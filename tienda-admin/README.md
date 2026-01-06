## Tienda Demo (storefront + admin)

Next.js App Router (TypeScript + Tailwind) con dos áreas:
- Storefront público con cards de productos, precio y stock. El botón añade unidades al carrito y abre WhatsApp con el resumen del pedido.
- Admin en `/admin` con formulario para crear/editar productos y refrescar inventario. Ruta protegida con contraseña simple.

Los datos viven en memoria (`src/lib/products.ts`) y se exponen vía API:
- `GET /api/products` lista todos.
- `POST /api/products` crea uno nuevo.
- `GET /api/products/:id` obtiene detalle.
- `PUT /api/products/:id` actualiza nombre, descripción, precio, stock o imagen.

### Scripts
- `npm run dev` arranca en http://localhost:3000
- `npm run lint` verifica ESLint
- `npm run build` compila para producción

### Notas
- API en memoria: los cambios se pierden al reiniciar el server.
- Auth admin: contraseña por defecto `admi1234` (variable `ADMIN_PASSWORD`). Login en `/admin/login`; middleware redirige si no hay cookie `admin_session`.
- Carrito: botón "Enviar a WhatsApp" arma el mensaje con cantidades y total usando la app de WhatsApp del usuario.
	- Número de WhatsApp: `3498401394` (variable `WHATSAPP_NUMBER`).
