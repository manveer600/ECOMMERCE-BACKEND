const BrandModel = require("../models/BrandModel")

const fetchBrands = async (req, res) => {
    try {
        const brands = await BrandModel.find({}).exec();
        res.status(201).json({
            success: true,
            message: 'Brands Fetched Successfully',
            brands
        })
    } catch (e) {
        res.status(400).json(err);
    }
}


const createBrand = async (req, res) => {

    try {
        const existingBrand = await BrandModel.findOne(
            {
                $or: [
                    {
                        label: { $regex: req.body.value, $options: 'i' }
                    },
                    {
                        value: { $regex: req.body.value, $options: 'i' }
                    }
                ]
            }
        );
        console.log('existingBrand is', existingBrand);
        if (existingBrand) {
            return res.status(400).json({
                success: false,
                message: 'Brand Already exists',
            })
        }
        const newBrand = await BrandModel.create({ label: req.body.value, value: req.body.value });

        return res.status(201).json({
            success: true,
            message: 'New brand has been created',
            data: newBrand
        })
    } catch (e) {
        return res.status(400).json({ message: e });
    }
}



module.exports = { fetchBrands, createBrand }