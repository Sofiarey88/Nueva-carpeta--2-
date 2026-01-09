## Tienda Demo (storefront + admin)

Next.js App Router (TypeScript + Tailwind) con dos áreas:
- Storefront público con cards de productos, precio y stock. El botón añade unidades al carrito y abre WhatsApp con el resumen del pedido.
- Admin en `/admin` con formulario para crear/editar productos y refrescar inventario. Ruta protegida con contraseña simple.

Los datos se exponen vía API y ahora pueden vivir en MongoDB Atlas.
- `GET /api/products` lista todos.
- `POST /api/products` crea uno nuevo.
- `GET /api/products/:id` obtiene detalle.
- `PUT /api/products/:id` actualiza nombre, descripción, precio, stock o imagen.

### Configurar MongoDB Atlas
- Variables de entorno:
	- `MONGODB_URI`: cadena de conexión Atlas.
	- `MONGODB_DB`: nombre de la base (por ejemplo `Página Web`).
- Crea un archivo `.env.local` a partir de `.env.example` y pon tu conexión:
	- `MONGODB_URI=mongodb+srv://sofiarey02:<db_password>@clusterispsofirey.zlkouxx.mongodb.net/?appName=ClusterISPSofiRey`
	- `MONGODB_DB=Página Web`
- La colección usada es `products` y se crea automáticamente al insertar.

### Scripts
- `npm run dev` arranca en http://localhost:3000
- `npm run lint` verifica ESLint
- `npm run build` compila para producción

### Notas
- Si no defines `MONGODB_URI`, la app fallará al iniciar.
- Auth admin: contraseña por defecto `admi1234` (variable `ADMIN_PASSWORD`). Login en `/admin/login`; middleware redirige si no hay cookie `admin_session`.
- Carrito: botón "Enviar a WhatsApp" arma el mensaje con cantidades y total usando la app de WhatsApp del usuario.
	- Número de WhatsApp: `3498401394` (variable `WHATSAPP_NUMBER`).
