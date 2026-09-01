import { CartItem, Product } from '../types';

export const formatBDT = (amount: number): string => {
  return '৳' + Number(amount || 0).toLocaleString('en-IN');
};

export const getWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const buildProductWhatsAppMessage = (
  product: Product,
  variant: string,
  quantity: number,
  settingsPhone: string,
  origin: string
): string => {
  const lineTotal = product.price * quantity;
  return [
    `*✨ New Order Request — VELORA*`,
    ``,
    `*Item:* ${product.name}`,
    `*Variant:* ${variant || 'Standard'}`,
    `*Quantity:* ${quantity}`,
    `*Price:* ${formatBDT(product.price)}`,
    `*Total Amount:* ${formatBDT(lineTotal)}`,
    `*Product Link:* ${origin}#/product/${product.slug}`,
    ``,
    `*Delivery Details:*`,
    `Name: `,
    `Phone: `,
    `Address: `,
    `City/Zone: (Inside Dhaka / Outside Dhaka)`,
    ``,
    `_Cash on delivery nationwide · Dhaka ৳80 | Outside ৳150_`,
  ].join('\n');
};

export const buildCartWhatsAppMessage = (
  items: CartItem[],
  zone: 'dhaka' | 'outside',
  shippingFee: number,
  customerName?: string,
  customerPhone?: string,
  address?: string,
  orderId?: string,
  origin?: string
): string => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + shippingFee;

  const itemLines = items.map((item, idx) => {
    const v = [item.size, item.color].filter(Boolean).join(' / ');
    return `${idx + 1}. *${item.name}*\n   • Variant: ${v || 'Standard'}\n   • Qty: ${item.qty} × ${formatBDT(item.price)} = ${formatBDT(item.price * item.qty)}`;
  });

  return [
    `*✨ New Order Request — VELORA*`,
    orderId ? `*Order ID:* ${orderId}` : '',
    ``,
    `*Ordered Items:*`,
    itemLines.join('\n\n'),
    ``,
    `*Subtotal:* ${formatBDT(subtotal)}`,
    `*Shipping (${zone === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}):* ${formatBDT(shippingFee)}`,
    `*Total Payable:* ${formatBDT(total)}`,
    ``,
    `*Customer Information:*`,
    `Name: ${customerName || ''}`,
    `Phone: ${customerPhone || ''}`,
    `Delivery Address: ${address || ''}`,
    `Delivery Zone: ${zone === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}`,
    ``,
    `_Payment Method: Cash on Delivery (COD) / bKash_`,
  ].filter(Boolean).join('\n');
};
