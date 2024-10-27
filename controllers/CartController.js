const CartModel = require("../models/CartModel");

exports.fetchCartByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const cart = await CartModel.find({ userId: id }).populate('userId').populate('productId');
        console.log('cart is this', cart);
        if (cart)
            return res.status(201).json({
                success: true,
                message: 'Cart Fetched Successfully',
                data: cart
            })
        else return res.status(201).json({
            success: false,
            message: 'No items in the cart',
        })
    } catch (e) {
        console.log("error while fetching card", e);
        return res.status(400).json(e);
    }
}

exports.deleteCart = async (req, res) => {
    const { itemId } = req.params;
    await CartModel.findByIdAndDelete({ _id: itemId });
    return res.status(200).json({
        message: 'Deleted Successfully',
        id: itemId
    })
}

exports.addToCart = async (req, res) => {
    const { id } = req.user;
    try {
        const newCart = await CartModel.create({ ...req.body, userId: id });
        const populatedCart = await newCart.populate(['userId', 'productId']);
        return res.status(201).json({
            success: true,
            message: 'Cart has been created',
            data: populatedCart
        })
    } catch (e) {
        return res.status(400).json({ message: e });
    }
}

exports.updateItemsInCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const data = await CartModel.findOneAndUpdate({ userId: userId, productId: productId }, { quantity: quantity }, { new: true });
    const populatedData = await data.populate(['userId', 'productId']);
    return res.status(200).json({
        success: true,
        message: "Cart Updated Successfully",
        updatedItem: populatedData
    })
}