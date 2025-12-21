/**
 * Sistema de Alertas Automáticas
 * Monitorea eventos y envía notificaciones al admin
 */

import { db } from '@/firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

export type AlertType = 'error' | 'warning' | 'info' | 'success';
export type AlertCategory = 'payment' | 'stock' | 'order' | 'system' | 'security';

export interface Alert {
  id?: string;
  type: AlertType;
  category: AlertCategory;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Crea una nueva alerta en el sistema
 */
export async function createAlert(
  type: AlertType,
  category: AlertCategory,
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<string | null> {
  try {
    const alertRef = await addDoc(collection(db, 'alerts'), {
      type,
      category,
      title,
      message,
      data: data || {},
      isRead: false,
      createdAt: Timestamp.now(),
    });
    return alertRef.id;
  } catch (error) {
    console.error('Error creando alerta:', error);
    return null;
  }
}

/**
 * Alertas predefinidas para eventos comunes
 */
export const AlertTemplates = {
  // Alertas de pago
  paymentFailed: (orderId: string, reason: string) => 
    createAlert('error', 'payment', 'Pago Fallido', 
      `El pago de la orden ${orderId.slice(0, 8)} falló: ${reason}`,
      { orderId, reason }
    ),

  paymentReceived: (orderId: string, amount: number) =>
    createAlert('success', 'payment', 'Pago Recibido',
      `Se recibió pago de $${amount.toLocaleString('es-AR')} para orden ${orderId.slice(0, 8)}`,
      { orderId, amount }
    ),

  // Alertas de stock
  lowStock: (productName: string, currentStock: number) =>
    createAlert('warning', 'stock', 'Stock Bajo',
      `${productName} tiene solo ${currentStock} unidades`,
      { productName, currentStock }
    ),

  outOfStock: (productName: string) =>
    createAlert('error', 'stock', 'Sin Stock',
      `${productName} se quedó sin stock`,
      { productName }
    ),

  // Alertas de órdenes
  newOrder: (orderId: string, amount: number) =>
    createAlert('info', 'order', 'Nueva Orden',
      `Nueva orden por $${amount.toLocaleString('es-AR')}`,
      { orderId, amount }
    ),

  orderCancelled: (orderId: string, reason?: string) =>
    createAlert('warning', 'order', 'Orden Cancelada',
      `Orden ${orderId.slice(0, 8)} fue cancelada${reason ? `: ${reason}` : ''}`,
      { orderId, reason }
    ),

  // Alertas de sistema
  systemError: (errorType: string, details: string) =>
    createAlert('error', 'system', 'Error de Sistema',
      `${errorType}: ${details}`,
      { errorType, details }
    ),

  apiError: (endpoint: string, statusCode: number) =>
    createAlert('error', 'system', 'Error de API',
      `API ${endpoint} respondió con código ${statusCode}`,
      { endpoint, statusCode }
    ),

  // Alertas de seguridad
  suspiciousActivity: (ip: string, action: string) =>
    createAlert('warning', 'security', 'Actividad Sospechosa',
      `IP ${ip} realizó acción sospechosa: ${action}`,
      { ip, action }
    ),

  tooManyAttempts: (email: string, attemptType: string) =>
    createAlert('warning', 'security', 'Demasiados Intentos',
      `${email} excedió intentos de ${attemptType}`,
      { email, attemptType }
    ),
};

/**
 * Obtiene las alertas no leídas
 */
export async function getUnreadAlerts(maxResults = 20): Promise<Alert[]> {
  try {
    const alertsRef = collection(db, 'alerts');
    const q = query(
      alertsRef,
      where('isRead', '==', false),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Alert[];
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    return [];
  }
}

/**
 * Obtiene las alertas recientes (últimas 24 horas)
 */
export async function getRecentAlerts(maxResults = 50): Promise<Alert[]> {
  try {
    const alertsRef = collection(db, 'alerts');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const q = query(
      alertsRef,
      where('createdAt', '>=', Timestamp.fromDate(yesterday)),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Alert[];
  } catch (error) {
    console.error('Error obteniendo alertas recientes:', error);
    return [];
  }
}

/**
 * Contadores de alertas por tipo
 */
export async function getAlertCounts(): Promise<Record<AlertType, number>> {
  try {
    const alerts = await getUnreadAlerts(100);
    const counts = { error: 0, warning: 0, info: 0, success: 0 };
    
    alerts.forEach(alert => {
      counts[alert.type]++;
    });
    
    return counts;
  } catch (error) {
    return { error: 0, warning: 0, info: 0, success: 0 };
  }
}
