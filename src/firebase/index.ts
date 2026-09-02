// Facade usada por los módulos portados de la app de gestión
// (catálogo, detalle de producto, subida de diseños).
// Devuelve la instancia "sales": proyecto studio-4130674340-85ea0.
import getSalesApp, {
  getSalesDb,
  getSalesAuth,
  ensureSalesAuth,
} from "./sales";

export {
  getSalesApp as getFirebaseApp,
  getSalesDb,
  getSalesAuth,
  ensureSalesAuth,
};
export default getSalesApp;
