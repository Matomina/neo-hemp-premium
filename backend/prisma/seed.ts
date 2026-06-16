import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Admin user ─────────────────────────────────────────────────────────────
  // Requires ADMIN_EMAIL and ADMIN_PASS_HASH in environment
  // Generate hash: node -e "require('bcryptjs').hash('your_password',12).then(console.log)"
  const adminEmail = process.env['ADMIN_EMAIL'];
  const adminPassHash = process.env['ADMIN_PASS_HASH'];

  if (adminEmail && adminPassHash) {
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash: adminPassHash,
          name: 'Admin',
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }
  } else {
    console.warn('[seed] ADMIN_EMAIL or ADMIN_PASS_HASH not set in .env — skipping admin user creation.');
    console.warn('[seed] To generate a bcrypt hash: node -e "require(\'bcryptjs\').hash(\'Admin1234!\',12).then(console.log)"');
    console.warn('[seed] Set ADMIN_EMAIL and ADMIN_PASS_HASH in backend/.env then re-run the seed.');
  }

  // ── Business settings defaults ─────────────────────────────────────────────
  const settings = [
    { key: 'shop_name', value: 'Culture Bio Diamant' },
    { key: 'shop_email', value: 'contact@culturebiodiamant.fr' },
    { key: 'cbd_compliance_notice', value: 'Produits à base de chanvre conformes (THC < 0,3%). Aucune promesse médicale. Usage réservé aux majeurs.' },
    { key: 'stripe_enabled', value: false },
  ];

  for (const { key, value } of settings) {
    await prisma.businessSetting.upsert({
      where: { key },
      update: {},
      create: { key, value: value as Parameters<typeof prisma.businessSetting.create>[0]['data']['value'] },
    });
  }
  console.log('Business settings seeded.');

  console.log('Seed complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
