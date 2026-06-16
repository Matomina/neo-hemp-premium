import { prisma } from '../../config/prisma';
import { PUBLIC_PRODUCT_WHERE } from '../products/publicProductFilters';

export async function getCertificatesByProductSlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      ...PUBLIC_PRODUCT_WHERE,
    },
    include: {
      certificates: { where: { status: 'VALIDATED' } },
    },
  });
}

export async function listAllCertificates() {
  return prisma.certificate.findMany({ include: { product: { select: { name: true, slug: true } } }, orderBy: { createdAt: 'desc' } });
}
