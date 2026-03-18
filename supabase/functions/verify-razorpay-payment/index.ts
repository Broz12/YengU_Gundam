import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function requireText(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

async function signPayload(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization header." }, 401);

    const supabaseUrl = getEnv("SUPABASE_URL");
    const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY");
    const supabaseServiceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    const razorpayKeyId = getEnv("RAZORPAY_KEY_ID");
    const razorpayKeySecret = getEnv("RAZORPAY_KEY_SECRET");

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) return json({ error: "Unauthorized." }, 401);

    const body = await request.json();
    const checkoutOrderId = requireText(body.checkoutOrderId, "Checkout order id");
    const razorpayOrderId = requireText(body.razorpayOrderId, "Razorpay order id");
    const razorpayPaymentId = requireText(body.razorpayPaymentId, "Razorpay payment id");
    const razorpaySignature = requireText(body.razorpaySignature, "Razorpay signature");

    const { data: orderRow, error: orderError } = await serviceClient
      .from("orders")
      .select("*")
      .eq("id", checkoutOrderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !orderRow) return json({ error: "Order not found." }, 404);
    if (orderRow.payment_order_id !== razorpayOrderId) {
      return json({ error: "Razorpay order mismatch." }, 400);
    }

    const expectedSignature = await signPayload(
      `${razorpayOrderId}|${razorpayPaymentId}`,
      razorpayKeySecret,
    );

    if (expectedSignature !== razorpaySignature) {
      return json({ error: "Payment signature verification failed." }, 400);
    }

    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
    });

    if (!paymentResponse.ok) {
      const reason = await paymentResponse.text();
      return json({ error: `Failed to verify payment status: ${reason}` }, 500);
    }

    const payment = await paymentResponse.json();
    if (!["authorized", "captured"].includes(payment.status)) {
      return json({ error: `Payment is not successful yet. Current status: ${payment.status}` }, 400);
    }

    const { error: updateError } = await serviceClient
      .from("orders")
      .update({
        payment_id: razorpayPaymentId,
        payment_signature: razorpaySignature,
        payment_method: payment.method ?? null,
        payment_status: payment.status,
        order_status: "paid",
      })
      .eq("id", checkoutOrderId)
      .eq("user_id", user.id);

    if (updateError) return json({ error: updateError.message }, 500);

    return json({
      success: true,
      orderId: checkoutOrderId,
      productTitle: orderRow.product_title,
      paymentStatus: payment.status,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected error." }, 500);
  }
});
