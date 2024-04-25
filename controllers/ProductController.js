const ProductModel = require("../models/ProductModel");

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await ProductModel.create(req.body);
        return res.status(201).json({
            success:true,
            message: 'Product Created Successfully',
            Product: newProduct
        })
    } catch (err) {
        console.log('Error creating a product', err);
        return res.status(500).json({ message: 'Error creating a product' });

    }
}


exports.fetchAllProducts = async (req, res) => {
    let query = ProductModel.find({deleted:{$ne:true}});
    let totalProductQuery = ProductModel.find({});


    if (req.query.category) {
        query = query.find({ category: req.query.category });
        totalProductQuery = totalProductQuery.find({ category: req.query.category });
    }

    if (req.query.brand) {
        query = query.find({ brand: req.query.brand });
        totalProductQuery = totalProductQuery.find({ brand: req.query.brand });
    }

    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
        totalProductQuery = totalProductQuery.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProductQuery.count();


    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    try {
        const docs = await query.exec();
        // res.set('X-TOTAL-COUNT', totalDocs);

        return res.status(201).json({
            success: true,
            message: 'All items fetched successfully',
            products: docs,
            totalDocs:totalDocs
        })
    } catch (err) {
        console.log('Error creating a product', err);
        return res.status(500).json({ message: 'Error creating a product' });
    }
}


exports.fetchProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductModel.findById(id);
        if (product) {
            return res.status(200).json({
                success: true,
                message: 'Product found with the given id',
                product: product
            })
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message:e
        })
    }

}


exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductModel.findByIdAndUpdate(id,req.body, {new:true});    //{new:true} to view the new updated product not the old one
        if (product) {
            return res.status(200).json({
                success: true,
                message: 'Product updated with the given id',
                product: product
            })
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message:e
        })
    }

}

