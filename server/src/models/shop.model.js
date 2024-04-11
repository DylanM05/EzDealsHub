import mongoose from 'mongoose';

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Shop name is required'
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String, 
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });

const Shop = mongoose.model('Shop', ShopSchema);
export default Shop;