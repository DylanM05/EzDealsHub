import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  billingAddress: {
    street: String,
    city: String,
    province: String,
    postalcode: String,
  },
  shippingAddress: {
    street: String,
    city: String,
    province: String,
    postalcode: String,
  },
  paymentInfo: {
    method: String,
    cardName: String,
    cardNumber: String,
    expiryDate: String,
    cvv: String,
  },
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;