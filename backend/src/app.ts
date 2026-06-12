import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './config/cors';
import { defaultRateLimit, authRateLimit } from './middlewares/rateLimit';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { requireAdmin } from './middleware/adminAuth';
import { ENV } from './config/env';

// Modules
import productsRouter from './modules/products/products.routes';
import ordersRouter from './modules/orders/orders.routes';
import authRouter from './modules/auth/auth.routes';
import adminRouter from './modules/admin/admin.routes';
import contactRouter from './modules/contact/contact.routes';
import certificatesRouter from './modules/certificates/certificates.routes';
import adminAuthRouter from './modules/admin/auth/adminAuth.router';
import quotesRouter from './modules/quotes/quotes.router';
import paymentsWebhookRouter from './modules/payments/payments.webhook.router';
import paymentsAdminRouter from './modules/payments/payments.admin.router';
import invoicesRouter from './modules/invoices/invoices.router';
import dashboardRouter from './modules/dashboard/dashboard.router';

const app = express();

app.use(helmet());
app.use(corsMiddleware);

// ── Stripe webhook — raw body BEFORE express.json() ──────────────────────────
app.use('/api/stripe', paymentsWebhookRouter);

app.use(express.json());
app.use(defaultRateLimit);

// ── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: ENV.NODE_ENV,
    stripeEnabled: ENV.STRIPE_ENABLED,
    notice: 'Culture Bio Diamant API — paiement en mode test uniquement',
  });
});

// ── Public routes ────────────────────────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/quotes', quotesRouter);

// ── Admin auth (rate-limited, no requireAdmin — login is public) ──────────────
app.use('/api/admin/auth', authRateLimit, adminAuthRouter);

// ── Admin — dashboard ─────────────────────────────────────────────────────────
app.use('/api/admin/dashboard', requireAdmin, dashboardRouter);

// ── Admin — invoices ──────────────────────────────────────────────────────────
app.use('/api/admin/invoices', invoicesRouter);

// ── Admin — payments ──────────────────────────────────────────────────────────
app.use('/api/admin/payments', requireAdmin, paymentsAdminRouter);

// ── Admin — legacy module (orders/contacts/certificates legacy admin) ─────────
app.use('/api/admin', requireAdmin, adminRouter);

// ── 404 + errors ─────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
