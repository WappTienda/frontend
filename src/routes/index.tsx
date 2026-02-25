import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { PublicLayout, AdminLayout } from '@/components/layouts';
import { HomePage, CheckoutPage, OrderPage, NotFoundPage } from '@/pages/public';
import {
  LoginPage,
  DashboardPage,
  ProductsPage,
  OrdersPage,
  OrderDetailPage,
  SettingsPage,
} from '@/pages/admin';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public layout route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: PublicLayout,
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/order/$publicId',
  component: OrderPage,
});

// Admin login route (no layout)
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: LoginPage,
});

// Admin layout route with auth check
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: AdminLayout,
  beforeLoad: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw redirect({ to: '/admin/login' });
    }
  },
});

// Admin routes
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: DashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/products',
  component: ProductsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/orders',
  component: OrdersPage,
});

const adminOrderDetailRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/orders/$orderId',
  component: OrderDetailPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/settings',
  component: SettingsPage,
});

// Catch-all 404 route
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: NotFoundPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([homeRoute, checkoutRoute, orderRoute]),
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminOrdersRoute,
    adminOrderDetailRoute,
    adminSettingsRoute,
  ]),
  notFoundRoute,
]);

// Create router
export const router = createRouter({ routeTree });
export { orderRoute, adminOrderDetailRoute };

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
