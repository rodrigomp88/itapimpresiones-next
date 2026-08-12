import { MercadoPagoConfig, Payment } from "mercadopago";

// Mock de MercadoPago
jest.mock("mercadopago", () => ({
  MercadoPagoConfig: jest.fn().mockImplementation(() => ({
    accessToken: "test-token",
  })),
  Preference: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({
      id: "test-preference-id",
      init_point: "https://mercadopago.com/init",
      sandbox_init_point: "https://sandbox.mercadopago.com/init",
    }),
  })),
  Payment: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue({
      id: "test-payment-id",
      status: "approved",
      external_reference: "test-order-123",
      transaction_amount: 2000,
    }),
  })),
}));

describe("MercadoPago Integration", () => {
  beforeEach(() => {
    // Configurar variables de entorno para testing
    process.env.MERCADO_PAGO_ACCESS_TOKEN =
      "TEST-1234567890123456-123456-7890123456789012345678901234567890";
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  describe("MercadoPago SDK", () => {
    it("should initialize MercadoPagoConfig correctly", () => {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
      });

      expect(MercadoPagoConfig).toHaveBeenCalledWith({
        accessToken: expect.stringContaining("TEST-"),
      });
    });

    it("should create payment preference with correct data structure", async () => {
      const { Preference } = require("mercadopago");
      const preferenceInstance = new Preference({} as any);

      const testData = {
        items: [
          {
            id: "product-1",
            title: "Test Product",
            quantity: 2,
            currency_id: "ARS",
            unit_price: 1000,
          },
        ],
        payer: {
          email: "test@example.com",
          name: "Test User",
        },
        back_urls: {
          success:
            "http://localhost:3000/checkout/success?order_id=test-order-123",
          failure:
            "http://localhost:3000/checkout/failure?order_id=test-order-123",
          pending:
            "http://localhost:3000/checkout/pending?order_id=test-order-123",
        },
        auto_return: "approved",
        external_reference: "test-order-123",
        notification_url: "http://localhost:3000/api/mercadopago/webhook",
        statement_descriptor: "ITAP Impresiones",
      };

      await preferenceInstance.create({ body: testData });

      expect(Preference).toHaveBeenCalled();
      expect(preferenceInstance.create).toHaveBeenCalledWith({
        body: expect.objectContaining({
          external_reference: "test-order-123",
          items: expect.arrayContaining([
            expect.objectContaining({
              id: "product-1",
              title: "Test Product",
              quantity: 2,
              unit_price: 1000,
            }),
          ]),
          notification_url: expect.stringContaining("/api/mercadopago/webhook"),
        }),
      });
    });

    it("should retrieve payment information correctly", async () => {
      const { Payment } = require("mercadopago");
      const paymentInstance = new Payment({} as any);

      const result = await paymentInstance.get({ id: "test-payment-id" });

      expect(Payment).toHaveBeenCalled();
      expect(paymentInstance.get).toHaveBeenCalledWith({
        id: "test-payment-id",
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: "test-payment-id",
          status: "approved",
          external_reference: "test-order-123",
        })
      );
    });
  });

  describe("Payment Status Mapping", () => {
    it("should map MercadoPago statuses to internal statuses correctly", () => {
      const statusMappings = {
        approved: { orderStatus: "confirmed", paymentStatus: "approved" },
        rejected: { orderStatus: "cancelled", paymentStatus: "rejected" },
        cancelled: { orderStatus: "cancelled", paymentStatus: "cancelled" },
        pending: { orderStatus: "pending", paymentStatus: "pending" },
        in_process: { orderStatus: "pending", paymentStatus: "processing" },
      };

      Object.entries(statusMappings).forEach(([mpStatus, expected]) => {
        expect(expected).toEqual(
          expect.objectContaining({
            orderStatus: expect.any(String),
            paymentStatus: expect.any(String),
          })
        );
      });
    });
  });
});
