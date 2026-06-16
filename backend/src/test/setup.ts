import { vi, afterEach } from 'vitest';

// Set required env vars BEFORE anything else is imported
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-secret-for-ci-with-minimum-length-of-32-chars';
process.env['ADMIN_EMAIL'] = 'admin@test.local';
process.env['ADMIN_PASS_HASH'] = '$2b$12$testhashtesthasttesthasttesthasttesthasttesthasttesthas';
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/test';
process.env['FRONTEND_ORIGINS'] = 'http://localhost:5173';
process.env['APP_PUBLIC_URL'] = 'http://localhost:5173';
process.env['STRIPE_ENABLED'] = 'false';
process.env['SMTP_HOST'] = '';
process.env['SMTP_USER'] = '';
process.env['SMTP_PASS'] = '';
process.env['SMTP_FROM'] = 'Culture Bio Diamant Test <test@example.com>';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'mock-id' }),
      verify: vi.fn().mockResolvedValue(true),
    })),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});
