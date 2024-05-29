const OrdersModel = require("../models/OrdersModel");

exports.fetchOrderByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await OrdersModel.find({ loggedInUserId: userId }).populate('loggedInUserId');
        return res.status(201).json({
            success: true,
            message: 'Order Fetched Successfully',
            orders: orders
        })
    } catch (e) {
        console.log('unable to fetch the order', e.message);
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
}

exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    await OrdersModel.findByIdAndDelete({ _id: orderId });
    return res.status(200).json({
        message: 'Deleted Successfully',
        orderId: orderId
    })
}

exports.addOrder = async (req, res) => {
    try {
        const newOrder = await OrdersModel.create(req.body);

        return res.status(201).json({
            success: true,
            message: 'Order has been created successfully',
            order: newOrder
        })
    } catch (e) {
        return res.status(400).json({ message: e });
    }
}

exports.updateOrder = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = OrdersModel.findByIdAndUpdate(orderId, req.body, {
            new: true //SEARCH KI NEW KRNE SE KYA HOGA
        }, () =>
            console.log('success while updating')
        );
        return res.status(200).json(order);
    } catch (err) {
        return res.status(400).json(err);
    }


}

exports.fetchAllOrders = async (req, res) => {
    try {
        const orders = await OrdersModel.find({}).populate('loggedInUserId');
        console.log('all orders found', orders);
        console.log('orders.length is', orders.length);
        return res.status(201).json({
            success: true,
            message: 'Orders Fetched Successfully',
            orders: orders
        })
    } catch (e) {
        console.log('unable to fetch the order', e.message);
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
}