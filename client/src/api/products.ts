import api from './client';
import type { Product } from '../types/product';

export async function createProduct(product: Product): Promise<Product> {
  const res = await api.post('/products', product);
  return res.data.data;
}

export async function getProduct(id: string): Promise<Product> {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await api.put(`/products/${id}`, product);
  return res.data.data;
}

export async function getProducts(params?: Record<string, any>): Promise<{ data: Product[], pagination: any }> {
  const res = await api.get('/products', { params });
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
