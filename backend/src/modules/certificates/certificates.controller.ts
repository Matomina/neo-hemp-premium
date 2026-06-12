import type { RequestHandler } from 'express';
import { getCertificatesByProductSlug, listAllCertificates } from './certificates.service';

export const getCertificates: RequestHandler = async (req, res, next) => {
  try {
    const certs = await getCertificatesByProductSlug(String(req.params.productSlug));
    res.json(certs);
  } catch (err) { next(err); }
};

export const adminListCertificates: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await listAllCertificates());
  } catch (err) { next(err); }
};
