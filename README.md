# E-Commerce Frontend

Frontend para sistema de e-commerce con panel de administración, desarrollado con React 19 y TypeScript.

## 🚀 Tech Stack

| Tecnología | Propósito |
|------------|-----------|
| **React 19** | UI Library |
| **TypeScript 5.9** | Type Safety |
| **Vite 7** | Build Tool & Dev Server |
| **TailwindCSS 4** | Styling |
| **TanStack Router** | Routing con type safety |
| **TanStack Query** | Server State Management |
| **Zustand** | Client State Management |
| **React Hook Form + Zod** | Forms & Validation |
| **Axios** | HTTP Client |
| **Recharts** | Data Visualization |

## 📁 Estructura del Proyecto

```
src/
├── api/                 # Cliente HTTP y endpoints
│   ├── client.ts        # Configuración de Axios
│   └── index.ts         # API functions
├── assets/              # Recursos estáticos
├── components/
│   ├── layouts/         # Layouts (Admin, Public)
│   └── ui/              # Componentes reutilizables
├── hooks/               # Custom React hooks
├── lib/                 # Utilidades
├── pages/
│   ├── admin/           # Panel de administración
│   └── public/          # Tienda pública
├── routes/              # Configuración de rutas
├── stores/              # Estado global (Zustand)
├── types/               # TypeScript interfaces
├── index.css            # Estilos globales
└── main.tsx             # Entry point
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🌐 Rutas

### Públicas
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage | Catálogo de productos |
| `/checkout` | CheckoutPage | Carrito y formulario de pedido |
| `/order/:publicId` | OrderPage | Estado del pedido |

### Admin (requiere autenticación)
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin/login` | LoginPage | Inicio de sesión |
| `/admin` | DashboardPage | Dashboard con estadísticas |
| `/admin/products` | ProductsPage | Gestión de productos |
| `/admin/orders` | OrdersPage | Lista de pedidos |
| `/admin/orders/:orderId` | OrderDetailPage | Detalle de pedido |

## 📦 API Endpoints

El frontend consume una API REST con los siguientes módulos:

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Productos
- `GET /products` - Listar productos (público)
- `GET /products/admin` - Listar todos los productos (admin)
- `POST /products` - Crear producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

### Pedidos
- `POST /orders/public` - Crear pedido (público)
- `GET /orders/public/:publicId` - Consultar pedido por ID público
- `GET /orders` - Listar pedidos (admin)
- `PATCH /orders/:id` - Actualizar estado del pedido

### Categorías
- `GET /categories` - Listar categorías

### Analytics
- `GET /analytics/dashboard` - Estadísticas del dashboard
- `GET /analytics/orders` - Estadísticas de pedidos
- `GET /analytics/products` - Productos más vendidos

## 🔐 Autenticación

El sistema utiliza JWT para autenticación:

1. El token se almacena en `localStorage` y en el store de Zustand
2. Las rutas `/admin/*` están protegidas con `beforeLoad` guard
3. El token se envía automáticamente en el header `Authorization`

## 🎨 Componentes UI

La librería de componentes incluye:

- `Button` - Botón con variantes (primary, secondary, outline, ghost)
- `Input` - Campo de texto
- `Select` - Selector desplegable
- `Textarea` - Área de texto
- `Card` - Contenedor con estilos
- `Badge` - Etiquetas de estado
- `Label` - Etiquetas para formularios
- `Spinner` - Indicador de carga

## 📊 Estado Global

### AuthStore
Maneja el estado de autenticación:
- `user` - Usuario actual
- `accessToken` - Token JWT
- `isAuthenticated` - Estado de autenticación
- `login()` / `logout()` - Acciones

### CartStore
Maneja el carrito de compras:
- `items` - Productos en el carrito
- `addItem()` / `removeItem()` / `updateQuantity()`
- `clearCart()` - Vaciar carrito
- `total` - Total calculado

## 🧪 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (Vite)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # ESLint
```

## 📝 Variables de Entorno

Crear un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📄 Licencia

MIT
