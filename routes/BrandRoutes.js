const {fetchBrands, createBrand} = require('../controllers/BrandController.js')
const express = require('express');
const { isLoggedIn } = require('../middleware/Auth');

const router = express.Router();

router.get('/', isLoggedIn ,fetchBrands);
router.post('/',isLoggedIn, createBrand)


module.exports = router;
