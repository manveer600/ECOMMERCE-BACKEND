const OrdersModel = require("../models/OrdersModel");

exports.fetchOrderByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await OrdersModel.find({ loggedInUserId: userId }).populate('loggedInUserId');
        console.log('user orders fetched successfully', orders);
        if (orders)
            return res.status(201).json({
                success: true,
                message: 'Order Fetched Successfully',
                data: orders
            })
        else return res.status(400).json({
            success: false,
            message: 'No orders found',
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
    console.log('order id to update', orderId);
    try {
        const updatedOrder = await OrdersModel.findOne({
            _id: orderId
        });
        updatedOrder.status = req.body.status;
        await updatedOrder.save();
        if (updatedOrder) {
            return res.status(200).json({
                success: true,
                message: "Order updated successfully",
                data: updatedOrder
            });
        }
    } catch (err) {
        console.log('error while updating order', err);
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }


}

exports.fetchAllOrders = async (req, res) => {
    try {
        let sortFilter = {};
        if (req.query.sort && req.query.order) {
            const sortOrder = req.query.order === 'asc' ? 1 : -1;
            sortFilter = { [req.query.sort]: sortOrder };
            console.log('sortFilter is this', sortFilter);
            //basically sortFilter = {id:1} or {totalAmount:1}
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalDocuments = await OrdersModel.countDocuments();
        console.log('total Docs', totalDocuments);
        const orders = await OrdersModel.find({}).sort(sortFilter).skip(skip).limit(limit).populate('loggedInUserId');
        return res.status(201).json({
            success: true,
            message: 'Orders Fetched Successfully',
            data: orders,
            docs: totalDocuments
        })
    } catch (e) {
        console.log('unable to fetch the order', e.message);
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
}