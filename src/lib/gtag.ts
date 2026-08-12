// Google Analytics 4 implementation para e-commerce tracking
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// E-commerce tracking events
export const trackAddToCart = (product: any) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "add_to_cart", {
    currency: "ARS",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

export const trackRemoveFromCart = (product: any) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "remove_from_cart", {
    currency: "ARS",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

export const trackBeginCheckout = (cartItems: any[], totalValue: number) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "begin_checkout", {
    currency: "ARS",
    value: totalValue,
    items: cartItems.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
};

export const trackAddPaymentInfo = (
  paymentMethod: string,
  totalValue: number
) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "add_payment_info", {
    currency: "ARS",
    value: totalValue,
    payment_type: paymentMethod,
  });
};

export const trackPurchase = (orderData: any) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "purchase", {
    transaction_id: orderData.id,
    value: orderData.total,
    currency: "ARS",
    items:
      orderData.items?.map((item: any) => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity || 1,
      })) || [],
  });
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("config", GA_TRACKING_ID, {
    page_title: pageTitle,
    page_location: pagePath,
  });
};

export const trackSearch = (searchTerm: string) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "search", {
    search_term: searchTerm,
  });
};

export const trackViewItem = (product: any) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "view_item", {
    currency: "ARS",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price,
      },
    ],
  });
};

// Custom events para el negocio
export const trackCustomTshirtOrder = (orderType: string, quantity: number) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "custom_tshirt_order", {
    event_category: "engagement",
    event_label: orderType,
    value: quantity,
  });
};

export const trackBagOrder = (bagType: string, quantity: number) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "custom_bag_order", {
    event_category: "engagement",
    event_label: bagType,
    value: quantity,
  });
};

// Event para cuando el usuario abre el WhatsApp
export const trackWhatsAppContact = (productName?: string) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "contact_whatsapp", {
    event_category: "engagement",
    event_label: productName || "general",
  });
};

// Event para descarga de catálogo
export const trackCatalogDownload = (catalogType: string) => {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", "download_catalog", {
    event_category: "engagement",
    event_label: catalogType,
  });
};
