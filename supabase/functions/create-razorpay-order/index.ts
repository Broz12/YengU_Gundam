import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { productCatalog } from "../_shared/catalog.ts";

const customizationFeeInr = 1000;

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

function validateText(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

function validateDeliveryDate(value: unknown) {
  const date = validateText(value, "Delivery date");
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const chosen = new Date(`${date}T00:00:00`);

  if (Number.isNaN(chosen.getTime()) || chosen < minDate) {
    throw new Error("Delivery date must be at least one day in the future.");
  }

  return date;
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
    const productCode = validateText(body.productCode, "Product code");
    const catalogItem = productCatalog[productCode];

    if (!catalogItem) return json({ error: "Unknown product code." }, 400);

    const deliveryDate = validateDeliveryDate(body.deliveryDate);
    const customizationRequested = Boolean(body.customizationRequested);
    const customizationNotes = typeof body.customizationNotes === "string" ? body.customizationNotes.trim() : "";
    const orderNotes = typeof body.notes === "string" ? body.notes.trim() : "";

    const shipping = {
      shipping_name: validateText(body.fullName, "Full name"),
      shipping_email: validateText(body.email, "Email"),
      shipping_phone: validateText(body.phone, "Phone"),
      shipping_line1: validateText(body.line1, "Address line 1"),
      shipping_line2: typeof body.line2 === "string" ? body.line2.trim() : "",
      shipping_city: validateText(body.city, "City"),
      shipping_state: validateText(body.state, "State"),
      shipping_pincode: validateText(body.pincode, "Pincode"),
    };

    const customizationFee = customizationRequested ? customizationFeeInr : 0;
    const totalPriceInr = catalogItem.basePriceInr + customizationFee;
    const amountPaise = totalPriceInr * 100;

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `yengu_${productCode}_${Date.now()}`,
        notes: {
          product_code: productCode,
          user_id: user.id,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const reason = await razorpayResponse.text();
      return json({ error: `Failed to create Razorpay order: ${reason}` }, 500);
    }

    const razorpayOrder = await razorpayResponse.json();

    const { data: orderRow, error: insertError } = await serviceClient
      .from("orders")
      .insert({
        user_id: user.id,
        product_code: productCode,
        product_title: catalogItem.title,
        base_price_inr: catalogItem.basePriceInr,
        customization_requested: customizationRequested,
        customization_fee_inr: customizationFee,
        customization_notes: customizationNotes || null,
        total_price_inr: totalPriceInr,
        delivery_date: deliveryDate,
        ...shipping,
        order_notes: orderNotes || null,
        payment_provider: "razorpay",
        payment_order_id: razorpayOrder.id,
        payment_status: "created",
        order_status: "payment_created",
      })
      .select("id, product_title")
      .single();

    if (insertError) return json({ error: insertError.message }, 500);

    return json({
      checkoutOrderId: orderRow.id,
      productTitle: orderRow.product_title,
      razorpayOrderId: razorpayOrder.id,
      amountPaise,
      currency: "INR",
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected error." }, 500);
  }
});
