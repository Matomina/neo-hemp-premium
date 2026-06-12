import { prisma } from '../../config/prisma';

export async function getCertificatesByProductSlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { certificates: { where: { status: 'VALIDATED' } } },
  });
  return product?.certificates ?? [];
}

export async function listAllCertificates() {
  return prisma.certificate.findMany({ include: { product: { select: { name: true, slug: true } } }, orderBy: { createdAt: 'desc' } });
}
