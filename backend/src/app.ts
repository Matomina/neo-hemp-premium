import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './config/cors';
import { defaultRateLimit } from './middlewares/rateLimit';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import productsRouter from './modules/products/products.routes';
import ordersRouter from './modules/orders/orders.routes';
import authRouter from './modules/auth/auth.routes';
import adminRouter from './modules/admin/admin.routes';
import contactRouter from './modules/contact/contact.routes';
import certificatesRouter from './modules/certificates/certificates.routes';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(defaultRateLimit);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', notice: 'Culture Bio Diamant API — paiement non activé' });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);
app.use('/api/certificates', certificatesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
