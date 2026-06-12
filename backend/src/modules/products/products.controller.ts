import type { RequestHandler } from 'express';
import { ProductQuerySchema } from './products.schemas';
import { getProductBySlug, getProducts } from './products.service';

export const listProducts: RequestHandler = async (req, res, next) => {
  try {
    const query = ProductQuerySchema.parse(req.query);
    const data = await getProducts(query);
    res.json(data);
  } catch (err) { next(err); }
};

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await getProductBySlug(String(req.params.slug));
    if (!product) { res.status(404).json({ error: 'Product not found' }); return; }
    res.json(product);
  } catch (err) { next(err); }
};
