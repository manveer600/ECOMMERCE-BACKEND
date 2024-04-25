const CartModel = require("../models/CartModel");

exports.fetchCartByUser = async (req, res) => {
    console.log('req.user in fetchCartByUser', req.user);
    // const userId = req.query.userId;
    const {id} =  req.user;
    try {
        const cart = await CartModel.find({ userId: userId }).populate('userId').populate('productId');
        return res.status(201).json({
            success: true,
            message: 'Cart Fetched Successfully',
            cart: cart
        })
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}

exports.deleteCart = async(req,res) => {
    const {itemId} = req.params;
    console.log('item id found from params', req.params.itemId);
    await CartModel.findByIdAndDelete({_id:itemId});
    return res.status(200).json({
        message:'Deleted Successfully',
        id:itemId
    })
}

exports.addToCart = async (req, res) => {
    const {id} = req.user;
    try {
        const newCart = await CartModel.create({...req.body,userId:id});

        return res.status(201).json({
            success: true,
            message: 'Cart has been created',
            cart: newCart
        })
    } catch (e) {
        return res.status(400).json({ message: e });
    }
}



exports.updateItemsInCart = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    const data = await CartModel.findOne({userId:userId, productId:productId});
    data.quantity = data.quantity+1;
    await data.save();
    return res.status(200).json({
        status: 'success',
        message: "Cart Updated Successfully",
        updatedItem: data
    })
}