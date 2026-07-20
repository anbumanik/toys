import api from './client';

export interface OrderPayload {
  orderItems: {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string; // product ID
  }[];
  deliveryAddress: {
    houseNo: string;
    street: string;
    landmark?: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderNotes?: string;
}

export async function createOrder(orderData: OrderPayload) {
  const res = await api.post('/orders', orderData);
  return res.data;
}

export async function createRazorpayOrder(orderId: string) {
  const res = await api.post(`/orders/${orderId}/razorpay`);
  return res.data.data;
}

export async function verifyRazorpayPayment(orderId: string, paymentData: any) {
  const res = await api.post(`/orders/${orderId}/verify`, paymentData);
  return res.data;
}

export async function getMyOrders() {
  const res = await api.get('/orders/myorders');
  return res.data.data;
}

export async function getOrders() {
  const res = await api.get('/orders');
  return res.data.data;
}

export async function deliverOrder(orderId: string) {
  const res = await api.put(`/orders/${orderId}/deliver`);
  return res.data.data;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await api.put(`/orders/${orderId}/status`, { status });
  return res.data.data;
}
