const ProductModel = require("../models/ProductModel");
const cloudinary = require('cloudinary');
exports.createProduct = async (req, res) => {
    console.log(req.body);
    try {
        //uploading images and thumbnail to cloudinary
        try {
            const result = await cloudinary.v2.uploader.upload(req.body.thumbnail,
                { folder: 'ecommerce-thumbnails' }
            );
            let imagesUrl = [];
            for (let image of req.body.images) {
                const result = await cloudinary.v2.uploader.upload(image, { folder: 'ecommerce-images' });
                console.log('result is this', result);
                imagesUrl.push(result.url)
            }
            if (result) {
                console.log('url got is this', result.secure_url);
                req.body.thumbnail = result.secure_url;
            }
            if (imagesUrl) {
                req.body.images = imagesUrl;
            } else {
                console.error;
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: "Error uploading to cloudinary"
            })
        }

        const newProduct = await ProductModel.create(req.body);
        return res.status(200).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        })
    } catch (err) {
        console.log('Error creating a product', err.message);
        return res.status(500).json({ success: false, message: err.message });

    }
}

// exports.fetchAllProducts = async (req, res) => {
//     let query = ProductModel.find({
//         deleted: {
//             $ne: true
//         }
//     });
//     let totalProductQuery = ProductModel.find({});

//     if (req.query.category) {
//         query = query.find({ category: req.query.category });
//         totalProductQuery = totalProductQuery.find({ category: req.query.category });
//     }

//     if (req.query.brand) {
//         query = query.find({ brand: req.query.brand });
//         totalProductQuery = totalProductQuery.find({ brand: req.query.brand });
//     }

//     if (req.query._sort && req.query._order) {
//         query = query.sort({ [req.query._sort]: req.query._order });
//         totalProductQuery = totalProductQuery.sort({ [req.query._sort]: req.query._order });
//     }

//     const totalDocs = await totalProductQuery.countDocuments();
//     // if (req.query._page && req.query._limit) {
//     const pageSize = req.query._limit;
//     const page = req.query._page;
//     query = query.skip(pageSize * (page - 1)).limit(pageSize);
//     // }

//     try {
//         const docs = await query.exec();
//         // res.set('X-TOTAL-COUNT', totalDocs);
//         console.log('products are these', docs);
//         return res.status(201).json({
//             success: true,
//             message: 'All items fetched successfully',
//             products: docs,
//             totalDocs: totalDocs
//         })
//     } catch (err) {
//         console.log('Error getting a product', err.message);
//         return res.status(500).json({ success: false, message: err.message });
//     }
// }




// exports.fetchAllProducts = async (req, res) => {
//     try {
//         let query = ProductModel.find({ deleted: false });
//         let totalProductQuery = ProductModel.find({ deleted: false });

//         console.log('query', query);
//         console.log('totalProductQuery', totalProductQuery);

//         if (req.query.category) {
//             query = query.where('category').equals(req.query.category);
//             totalProductQuery = totalProductQuery.where('category').equals(req.query.category);
//         }

//         if (req.query.brand) {
//             query = query.where('brand').equals(req.query.brand);
//             totalProductQuery = totalProductQuery.where('brand').equals(req.query.brand);
//         }

//         if (req.query._sort && req.query._order) {
//             const sortOrder = req.query._order === 'asc' ? 1 : -1;
//             query = query.sort({ [req.query._sort]: sortOrder });
//         }

//         const totalDocs = await totalProductQuery.countDocuments();
//         console.log('total docs', totalDocs);

//         if (req.query._page && req.query._limit) {
//             const pageSize = parseInt(req.query._limit, 10);
//             const page = parseInt(req.query._page, 10);
//             query = query.skip(pageSize * (page - 1)).limit(pageSize);
//         }

//         const docs = await query.exec();
//         console.log('docs', docs);
//         // Setting the total count in the response headers if pagination is used
//         res.set('X-TOTAL-COUNT', totalDocs);

//         return res.status(200).json({
//             success: true,
//             message: 'All items fetched successfully',
//             products: docs,
//             totalDocs: totalDocs
//         });
//     } catch (err) {
//         console.log('Error getting products', err.message);
//         return res.status(500).json({ success: false, message: err.message });
//     }
// };



exports.fetchAllProducts = async (req, res) => {
    try {
        const where = { deleted: false };
        let sortFilter = {};
        if (req.query.title) {
            where.title = { $regex: req.query.title, $options: 'i' };
        }

        if (req.query.category) {
            where.category = { $regex: req.query.category, $options: 'i' };
        }
        if (req.query.brand) {
            where.brand = { $regex: req.query.brand, $options: 'i' };
        }
        if (req.query._sort && req.query._order) {
            const sortOrder = req.query._order === 'asc' ? 1 : -1;
            sortFilter = { [req.query._sort]: sortOrder };
        }
        console.log('where filter is this', where);
        //BASICALLY WE ARE COUNTING THE NUMBER OF DOCUMENTS WITH THE PROVIDED CONDITIONS.
        const totalDocs = await ProductModel.countDocuments(where);
        console.log('total documents', totalDocs);

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const products = await ProductModel.find(where).sort(sortFilter).skip(skip).limit(limit);
        res.set('X-TOTAL-COUNT', totalDocs);

        console.log(products);
        console.log(totalDocs);
        return res.status(200).json({
            success: true,
            message: 'All items fetched successfully',
            data: products,
            totalDocs: totalDocs
        });

    } catch (error) {
        console.log('error getting products', error.message);
        return res.status(500).json({ success: false, message: error.message });

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
            message: e
        })
    }

}

exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    console.log('req.body', req.body);
    try {
        const product = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
        product.images[0] = req.body.image1;
        product.images[1] = req.body.image2;
        product.images[2] = req.body.image3;

        await product.save();

        console.log('product is this now', product);
        if (product) {
            return res.status(200).json({
                success: true,
                message: 'Product updated with the given id',
                data: product
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Error updating product. Please try later!',
            })
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e
        })
    }

}

exports.deleteProduct = async (req, res) => {
    const { id } = req.body;
    console.log('req.body is', req.body);
    const productToBeDeleted = await ProductModel.findById(id);
    console.log('productToBeDeleted', productToBeDeleted)
    productToBeDeleted.deleted = true;
    await productToBeDeleted.save();

    console.log('productToBeDeleted', productToBeDeleted)
    return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: productToBeDeleted
    })
}

