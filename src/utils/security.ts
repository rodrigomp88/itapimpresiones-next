"use client";

// 🔒 UTILIDADES DE SEGURIDAD

/**
 * Sanitiza entrada de usuario para prevenir XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim()
    .substring(0, 100); // Límite de longitud
};

/**
 * Valida y parsea datos de localStorage
 */
export const safeLocalStorageGet = (key: string): string[] => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Validar que todos los elementos sean strings válidos
    return parsed.filter(item => 
      typeof item === 'string' && 
      item.length > 0 && 
      item.length < 255 // Límite de longitud por item
    );
  } catch (error) {
    console.error('Error al leer localStorage:', error);
    return [];
  }
};

/**
 * Guarda datos en localStorage con validación
 */
export const safeLocalStorageSet = (key: string, data: string[]): boolean => {
  try {
    // Validar tamaño total
    const jsonData = JSON.stringify(data);
    if (jsonData.length > 1024 * 1024) { // 1MB límite
      console.warn('Datos demasiado grandes para localStorage');
      return false;
    }
    
    // Validar contenido
    if (!Array.isArray(data) || data.some(item => typeof item !== 'string')) {
      console.warn('Datos inválidos para localStorage');
      return false;
    }
    
    localStorage.setItem(key, jsonData);
    return true;
  } catch (error) {
    console.error('Error al escribir localStorage:', error);
    return false;
  }
};

/**
 * Valida búsquedas para prevenir inyección
 */
export const validateSearchQuery = (query: string): boolean => {
  if (!query || typeof query !== 'string') return false;
  
  // Patrones peligrosos
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /eval\(/i,
    /function\(/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(query));
};
