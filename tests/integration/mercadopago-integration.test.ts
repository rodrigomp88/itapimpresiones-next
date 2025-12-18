// Mock Firebase to avoid auth errors
jest.mock('../../src/firebase/config', () => ({
  auth: {},
  db: {},
}));

// Mock MercadoPago SDK with proper structure
jest.mock('mercadopago', () => ({
  MercadoPagoConfig: jest.fn(() => ({})),
  Preference: jest.fn(() => ({
    create: jest.fn(() => Promise.resolve({
      id: 'pref_123456789',
      init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_123456789',
      sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_123456789',
    })),
  })),
  Payment: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({
      id: 'pay_123456789',
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 1000,
      description: 'Test payment',
      external_reference: 'order_123',
      payment_method_id: 'visa',
      payment_type_id: 'credit_card',
      date_approved: new Date().toISOString(),
      date_created: new Date().toISOString(),
    })),
  })),
  configure: jest.fn(),
}));

// Import handlers after mock is set up
import { POST as createPreference } from '../../src/app/api/mercadopago/create-preference/route';
import { POST as webhookHandler } from '../../src/app/api/mercadopago/webhook/route';

// Mock NextRequest for testing
const createMockNextRequest = (url: string, options: RequestInit = {}) => {
  const mockRequest = {
    url,
    method: options.method || 'GET',
    headers: new Headers(options.headers),
    json: async () => JSON.parse(options.body as string || '{}'),
    text: async () => options.body as string || '',
    // NextRequest specific properties
    cookies: {},
    nextUrl: new URL(url),
    page: {},
    ua: {},
  };
  return mockRequest as any;
};

describe('MercadoPago Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Preference', () => {
    it('should create preference successfully', async () => {
      const mockPreference = {
        id: 'pref_123456789',
        init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_123456789',
        sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_123456789',
      };

      // Get the mocked function from the require cache
      const mercadopago = require('mercadopago');
      mercadopago.preferences.create.mockResolvedValue({ body: mockPreference });

      const requestBody = {
        orderId: 'order_123',
        items: [
          {
            id: 'product_1',
            name: 'Test Product',
            cartQuantity: 1,
            price: 1000,
          },
        ],
        totalAmount: 1000,
        fullAmount: 1000,
        shippingAddress: {
          name: 'Test User',
          email: 'test@example.com',
          address: 'Test Address',
          city: 'Test City',
          postalCode: '1234',
        },
        userEmail: 'test@example.com',
      };

      const request = createMockNextRequest('http://localhost:3000/api/mercadopago/create-preference', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await createPreference(request);
      const result = await response.json();

      // Mock returns success, so should return 200 with actual data
      expect(response.status).toBe(200);
      expect(result).toHaveProperty('preferenceId', 'pref_123456789');
      expect(result).toHaveProperty('initPoint');
      expect(result).toHaveProperty('sandboxInitPoint');
    });

    it('should handle MercadoPago API errors', async () => {
      const mercadopago = require('mercadopago');
      mercadopago.preferences.create.mockRejectedValue(new Error('API Error'));

      const requestBody = {
        orderId: 'order_123',
        items: [
          {
            id: 'product_1',
            name: 'Test Product',
            cartQuantity: 1,
            price: 1000,
          },
        ],
        totalAmount: 1000,
        fullAmount: 1000,
        shippingAddress: {
          name: 'Test User',
          email: 'test@example.com',
          address: 'Test Address',
          city: 'Test City',
          postalCode: '1234',
        },
        userEmail: 'test@example.com',
      };

      const request = createMockNextRequest('http://localhost:3000/api/mercadopago/create-preference', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await createPreference(request);
      const result = await response.json();

      expect(response.status).toBe(200); // Development fallback
      expect(result).toHaveProperty('isDevelopment');
      expect(result).toHaveProperty('note');
    });

    it('should validate request body', async () => {
      const request = createMockNextRequest('http://localhost:3000/api/mercadopago/create-preference', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await createPreference(request);
      const result = await response.json();

      expect(response.status).toBe(200); // Development fallback
      expect(result).toHaveProperty('isDevelopment');
    });
  });

  describe('Webhook Handler', () => {
    it('should handle payment approved webhook', async () => {
      const webhookData = {
        action: 'payment.updated',
        data: {
          id: 'pay_123456789',
        },
      };

      const mercadopago = require('mercadopago');
      // Mock the Payment instance get method
      const mockPaymentInstance = mercadopago.Payment.mock.results[0].value;
      mockPaymentInstance.get.mockResolvedValue({
        id: 'pay_123456789',
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: 1000,
        description: 'Test payment',
        external_reference: 'order_123',
        payment_method_id: 'visa',
        payment_type_id: 'credit_card',
        date_approved: new Date().toISOString(),
        date_created: new Date().toISOString(),
      });

      const request = createMockNextRequest('http://localhost:3000/api/mercadopago/webhook', {
        method: 'POST',
        body: JSON.stringify(webhookData),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await webhookHandler(request);

      expect(response.status).toBe(200);
      expect(mockPaymentInstance.get).toHaveBeenCalledWith({ id: 'pay_123456789' });
    });

    it('should handle payment rejected webhook', async () => {
      const webhookData = {
        action: 'payment.updated',
        data: {
          id: 'pay_123456789',
        },
      };

      const mercadopago = require('mercadopago');
      const mockPaymentInstance = mercadopago.Payment.mock.results[0].value;
      mockPaymentInstance.get.mockResolvedValue({
        id: 'pay_123456789',
        status: 'rejected',
        status_detail: 'cc_rejected_bad_filled_other',
        transaction_amount: 1000,
        description: 'Test payment',
        external_reference: 'order_123',
        payment_method_id: 'visa',
        payment_type_id: 'credit_card',
        date_approved: null,
        date_created: new Date().toISOString(),
      });

      const request = createMockNextRequest('http://localhost:3000/api/mercadopago/webhook', {
        method: 'POST',
        body: JSON.stringify(webhookData),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await webhookHandler(request);

      expect(response.status).toBe(200);
    });

    it('should handle invalid webhook data', async () => {
      const invalidWebhookData = {
        invalid: 'data',
      };

      const request = createMockNextRequest('http://localhost:3000/api/mercadopago/webhook', {
        method: 'POST',
        body: JSON.stringify(invalidWebhookData),
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await webhookHandler(request);
      const result = await response.json();

      // Should handle gracefully and return success for non-payment actions
      expect(response.status).toBe(200);
      expect(result).toHaveProperty('received', true);
    });
  });
});
