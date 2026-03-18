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

function getFirstEnv(...names: string[]) {
  for (const name of names) {
    const value = Deno.env.get(name);
    if (value) return value;
  }

  throw new Error(`Missing environment variable. Expected one of: ${names.join(", ")}`);
}

function getOptionalEnv(name: string) {
  return Deno.env.get(name)?.trim() || "";
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

function normalisePhone(value: string) {
  return value.replace(/[^\d]/g, "");
}

function buildReceiptNumber(orderId: string) {
  return `YENGU-${orderId.slice(0, 8).toUpperCase()}`;
}

function buildOwnerEmailHtml(orderRow: Record<string, unknown>, receiptNumber: string) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0b1720;line-height:1.6">
      <h2 style="margin-bottom:8px;">New paid order received</h2>
      <p><strong>Receipt:</strong> ${receiptNumber}</p>
      <p><strong>Product:</strong> ${orderRow.product_title}</p>
      <p><strong>Total:</strong> Rs ${orderRow.total_price_inr}</p>
      <p><strong>Customer:</strong> ${orderRow.shipping_name}</p>
      <p><strong>Email:</strong> ${orderRow.shipping_email}</p>
      <p><strong>Phone:</strong> ${orderRow.shipping_phone}</p>
      <p><strong>Delivery date:</strong> ${orderRow.delivery_date}</p>
      <p><strong>Address:</strong> ${orderRow.shipping_line1}${orderRow.shipping_line2 ? `, ${orderRow.shipping_line2}` : ""}, ${orderRow.shipping_city}, ${orderRow.shipping_state} ${orderRow.shipping_pincode}</p>
      <p><strong>Customization:</strong> ${orderRow.customization_requested ? "Yes" : "No"}</p>
      <p><strong>Order notes:</strong> ${orderRow.order_notes || "None"}</p>
    </div>
  `;
}

function buildCustomerReceiptHtml(
  orderRow: Record<string, unknown>,
  receiptNumber: string,
  ownerEmail: string,
  ownerWhatsapp: string,
) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0b1720;line-height:1.6">
      <h2 style="margin-bottom:8px;">Your Yengu order receipt</h2>
      <p>Thank you for your order. Your payment has been confirmed.</p>
      <p><strong>Receipt:</strong> ${receiptNumber}</p>
      <p><strong>Product:</strong> ${orderRow.product_title}</p>
      <p><strong>Total paid:</strong> Rs ${orderRow.total_price_inr}</p>
      <p><strong>Delivery date:</strong> ${orderRow.delivery_date}</p>
      <p><strong>Customization:</strong> ${orderRow.customization_requested ? "Yes" : "No"}</p>
      <p>If you need help, contact us at ${ownerEmail || "our support email"}${ownerWhatsapp ? ` or WhatsApp ${ownerWhatsapp}` : ""}.</p>
    </div>
  `;
}

function buildOwnerWhatsappText(orderRow: Record<string, unknown>, receiptNumber: string) {
  return [
    "New paid order at Yengu",
    `Receipt: ${receiptNumber}`,
    `Product: ${orderRow.product_title}`,
    `Total: Rs ${orderRow.total_price_inr}`,
    `Customer: ${orderRow.shipping_name}`,
    `Phone: ${orderRow.shipping_phone}`,
    `Email: ${orderRow.shipping_email}`,
    `Delivery: ${orderRow.delivery_date}`,
  ].join("\n");
}

async function sendJsonRequest(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}

async function sendResendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
) {
  return await sendJsonRequest("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });
}

async function sendWhatsappMessage(
  accessToken: string,
  phoneNumberId: string,
  to: string,
  body: string,
) {
  return await sendJsonRequest(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body,
      },
    }),
  });
}

async function recordDelivery(
  serviceClient: ReturnType<typeof createClient>,
  payload: {
    order_id: string;
    receipt_id: string | null;
    user_id: string;
    channel: "owner_email" | "owner_whatsapp" | "customer_receipt_email";
    recipient: string;
    provider: string | null;
    status: "pending" | "sent" | "skipped" | "failed";
    provider_message_id?: string | null;
    response_body?: unknown;
    error_message?: string | null;
    sent_at?: string | null;
  },
) {
  await serviceClient.from("notification_deliveries").insert(payload);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization header." }, 401);

    const supabaseUrl = getEnv("SUPABASE_URL");
    const supabaseAnonKey = getFirstEnv("SUPABASE_ANON_KEY", "SUPABASE_PUBLISHABLE_KEY");
    const supabaseServiceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    const razorpayKeyId = getEnv("RAZORPAY_KEY_ID");
    const razorpayKeySecret = getEnv("RAZORPAY_KEY_SECRET");
    const ownerNotificationEmail = getOptionalEnv("OWNER_NOTIFICATION_EMAIL");
    const ownerNotificationWhatsapp = getOptionalEnv("OWNER_NOTIFICATION_WHATSAPP");
    const emailFrom = getOptionalEnv("EMAIL_FROM");
    const resendApiKey = getOptionalEnv("RESEND_API_KEY");
    const whatsappAccessToken = getOptionalEnv("WHATSAPP_ACCESS_TOKEN");
    const whatsappPhoneNumberId = getOptionalEnv("WHATSAPP_PHONE_NUMBER_ID");

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

    const receiptNumber = buildReceiptNumber(checkoutOrderId);
    const receiptPayload = {
      receiptNumber,
      orderId: checkoutOrderId,
      paymentStatus: payment.status,
      paymentId: razorpayPaymentId,
      productCode: orderRow.product_code,
      productTitle: orderRow.product_title,
      totalPriceInr: orderRow.total_price_inr,
      discountedBasePriceInr: orderRow.discounted_base_price_inr,
      discountAmountInr: orderRow.discount_amount_inr,
      deliveryDate: orderRow.delivery_date,
      shippingName: orderRow.shipping_name,
      shippingEmail: orderRow.shipping_email,
      shippingPhone: orderRow.shipping_phone,
    };

    const { data: receiptRow, error: receiptError } = await serviceClient
      .from("order_receipts")
      .upsert(
        {
          order_id: checkoutOrderId,
          user_id: user.id,
          receipt_number: receiptNumber,
          recipient_email: orderRow.shipping_email,
          owner_email: ownerNotificationEmail || null,
          payload: receiptPayload,
        },
        { onConflict: "order_id" },
      )
      .select("id")
      .single();

    if (receiptError) return json({ error: receiptError.message }, 500);

    const ownerEmailHtml = buildOwnerEmailHtml(orderRow, receiptNumber);
    const customerReceiptHtml = buildCustomerReceiptHtml(
      orderRow,
      receiptNumber,
      ownerNotificationEmail,
      ownerNotificationWhatsapp,
    );
    const ownerWhatsappText = buildOwnerWhatsappText(orderRow, receiptNumber);

    if (ownerNotificationEmail) {
      if (resendApiKey && emailFrom) {
        const result = await sendResendEmail(
          resendApiKey,
          emailFrom,
          ownerNotificationEmail,
          `New paid order | ${receiptNumber}`,
          ownerEmailHtml,
        );

        await recordDelivery(serviceClient, {
          order_id: checkoutOrderId,
          receipt_id: receiptRow.id,
          user_id: user.id,
          channel: "owner_email",
          recipient: ownerNotificationEmail,
          provider: "resend",
          status: result.ok ? "sent" : "failed",
          provider_message_id: result.ok ? result.body?.id ?? null : null,
          response_body: result.body,
          error_message: result.ok ? null : `Resend returned ${result.status}`,
          sent_at: result.ok ? new Date().toISOString() : null,
        });
      } else {
        await recordDelivery(serviceClient, {
          order_id: checkoutOrderId,
          receipt_id: receiptRow.id,
          user_id: user.id,
          channel: "owner_email",
          recipient: ownerNotificationEmail,
          provider: "resend",
          status: "skipped",
          error_message: "Missing RESEND_API_KEY or EMAIL_FROM.",
        });
      }
    }

    if (ownerNotificationWhatsapp) {
      if (whatsappAccessToken && whatsappPhoneNumberId) {
        const result = await sendWhatsappMessage(
          whatsappAccessToken,
          whatsappPhoneNumberId,
          normalisePhone(ownerNotificationWhatsapp),
          ownerWhatsappText,
        );

        await recordDelivery(serviceClient, {
          order_id: checkoutOrderId,
          receipt_id: receiptRow.id,
          user_id: user.id,
          channel: "owner_whatsapp",
          recipient: ownerNotificationWhatsapp,
          provider: "whatsapp_cloud",
          status: result.ok ? "sent" : "failed",
          provider_message_id: result.ok ? result.body?.messages?.[0]?.id ?? null : null,
          response_body: result.body,
          error_message: result.ok ? null : `WhatsApp returned ${result.status}`,
          sent_at: result.ok ? new Date().toISOString() : null,
        });
      } else {
        await recordDelivery(serviceClient, {
          order_id: checkoutOrderId,
          receipt_id: receiptRow.id,
          user_id: user.id,
          channel: "owner_whatsapp",
          recipient: ownerNotificationWhatsapp,
          provider: "whatsapp_cloud",
          status: "skipped",
          error_message: "Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID.",
        });
      }
    }

    if (orderRow.shipping_email) {
      if (resendApiKey && emailFrom) {
        const result = await sendResendEmail(
          resendApiKey,
          emailFrom,
          orderRow.shipping_email,
          `Your Yengu receipt | ${receiptNumber}`,
          customerReceiptHtml,
        );

        await recordDelivery(serviceClient, {
          order_id: checkoutOrderId,
          receipt_id: receiptRow.id,
          user_id: user.id,
          channel: "customer_receipt_email",
          recipient: orderRow.shipping_email,
          provider: "resend",
          status: result.ok ? "sent" : "failed",
          provider_message_id: result.ok ? result.body?.id ?? null : null,
          response_body: result.body,
          error_message: result.ok ? null : `Resend returned ${result.status}`,
          sent_at: result.ok ? new Date().toISOString() : null,
        });
      } else {
        await recordDelivery(serviceClient, {
          order_id: checkoutOrderId,
          receipt_id: receiptRow.id,
          user_id: user.id,
          channel: "customer_receipt_email",
          recipient: orderRow.shipping_email,
          provider: "resend",
          status: "skipped",
          error_message: "Missing RESEND_API_KEY or EMAIL_FROM.",
        });
      }
    }

    return json({
      success: true,
      orderId: checkoutOrderId,
      receiptNumber,
      productTitle: orderRow.product_title,
      paymentStatus: payment.status,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected error." }, 500);
  }
});
