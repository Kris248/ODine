import crypto from "crypto";
import { config } from "../config.js";
import { createHumanReference } from "../utils.js";

export function createMockPaymentRequest({
  checkoutSessionId,
  amount,
  currency,
  paymentMode,
  customer
}) {
  const gatewayOrderId = createHumanReference("GWO");
  const paymentReference = createHumanReference("PAY");
  const receiptNumber = createHumanReference("RCT");

  return {
    provider: config.mockPaymentProvider,
    paymentMode,
    gatewayOrderId,
    paymentReference,
    receiptNumber,
    amount,
    currency,
    status: "pending",
    customer,
    requestedAt: new Date(),
    action: {
      type: "mock_redirect",
      label: "Complete secure test payment",
      checkoutSessionId
    }
  };
}

export function signWebhookPayload(payload) {
  return crypto
    .createHmac("sha256", config.mockPaymentWebhookSecret)
    .update(JSON.stringify(payload))
    .digest("hex");
}

export function verifyWebhookSignature(rawBody, signature) {
  if (!signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", config.mockPaymentWebhookSecret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function buildMockWebhookEvent(session) {
  return {
    provider: config.mockPaymentProvider,
    eventType: "payment.captured",
    checkoutSessionId: String(session._id),
    sessionReference: session.sessionReference,
    restaurantId: String(session.restaurantId),
    amount: session.pricing.total,
    currency: session.pricing.currency,
    paymentMode: session.paymentMode,
    gatewayOrderId: session.paymentProof.gatewayOrderId,
    paymentReference: session.paymentProof.paymentReference,
    gatewayTransactionId: createHumanReference("GTX"),
    receiptNumber: session.paymentProof.receiptNumber,
    paymentTimestamp: new Date().toISOString()
  };
}
