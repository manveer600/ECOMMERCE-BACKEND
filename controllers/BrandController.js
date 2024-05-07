const BrandModel = require("../models/BrandModel")

const fetchBrands = async(req,res) => {
    try{
        const brands = await BrandModel.find({}).exec();
        res.status(201).json({
            success:true,
            message:'Brands Fetched Successfully',
            brands
        })
    }catch(e){
        res.status(400).json(err);
    }
}


const createBrand = async(req,res) => {
    try {
        const newBrand = await BrandModel.create(req.body);
        
        return res.status(201).json({
            success:true,
            message:'New brand has been created',
            brand:newBrand
        })
    }catch(e){
        return res.status(400).json({message:e});
    }
}



module.exports = {fetchBrands,createBrand}