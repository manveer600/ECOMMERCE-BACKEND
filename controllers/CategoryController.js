const CategoryModel = require("../models/CategoryModel.js")

const fetchCategories = async(req,res) => {
    try{
        const categories = await CategoryModel.find({});
        res.status(201).json({
            success:true,
            message:'Categories Fetched Successfully',
            categories
        })
    }catch(e){
        res.status(400).json(err);
    }
}

const createCategory = async(req,res) => {
    try {
        const newCategory = await CategoryModel.create(req.body);
        
        return res.status(201).json({
            success:true,
            message:'New category has been created',
            category:newCategory
        })
    }catch(e){
        return res.status(400).json({message:e});
    }
}

module.exports = {fetchCategories,createCategory}