const CategoryModel = require("../models/CategoryModel.js")

const fetchCategories = async (req, res) => {

    try {
        const categories = await CategoryModel.find({});
        res.status(201).json({
            success: true,
            message: 'Categories Fetched Successfully',
            categories
        })
    } catch (e) {
        res.status(400).json(err);
    }
}

const createCategory = async (req, res) => {
    console.log('adding category');
    console.log(req.body);
    try {
        const existingCategory = await CategoryModel.findOne(
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
        console.log('existingCategory is', existingCategory);
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category Already exists',
            })
        }
        const newCategory = await CategoryModel.create({ label: req.body.value, value: req.body.value });
        return res.status(201).json({
            success: true,
            message: 'New category has been created',
            data: newCategory
        })
    } catch (e) {
        return res.status(400).json({ message: e });
    }
}

module.exports = { fetchCategories, createCategory }