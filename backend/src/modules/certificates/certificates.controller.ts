import type { RequestHandler } from 'express';
import { getCertificatesByProductSlug, listAllCertificates } from './certificates.service';

export const getCertificates: RequestHandler = async (req, res, next) => {
  try {
    const product = await getCertificatesByProductSlug(String(req.params.productSlug));
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product.certificates);
  } catch (err) { next(err); }
};

export const adminListCertificates: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await listAllCertificates());
  } catch (err) { next(err); }
};
