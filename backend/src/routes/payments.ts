import { FastifyInstance } from "fastify";
import { z } from "zod";
import { confirmInfinitePayWebhookPayment } from "@/services/paymentWebhook";

export const paymentsRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/payments/infinitepay/webhook", async (request, reply) => {
    const bodySchema = z.object({
      invoice_slug: z.string().trim().min(1),
      amount: z.number().int().positive(),
      paid_amount: z.number().int().positive(),
      installments: z.number().int().positive(),
      capture_method: z.enum(["credit_card", "pix"]),
      transaction_nsu: z.string().trim().min(1),
      order_nsu: z.string().trim().min(1),
      receipt_url: z.url().optional(),
      items: z.array(z.unknown()).optional(),
    });

    const payload = bodySchema.parse(request.body);

    try {
      const result = await confirmInfinitePayWebhookPayment(payload);

      return reply.status(200).send(result);
    } catch (error) {
      request.log.error(error, "Failed to confirm InfinitePay webhook");

      if (error instanceof Error) {
        return reply.status(400).send({
          success: false,
          message: error.message,
        });
      }

      return reply.status(400).send({
        success: false,
        message: "Unknown webhook error.",
      });
    }
  });
};
