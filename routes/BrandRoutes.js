const {fetchBrands, createBrand} = require('../controllers/BrandController.js')
const express = require('express');
const { isLoggedIn } = require('../middleware/auth.js');

const router = express.Router();

router.get('/', isLoggedIn ,fetchBrands);
router.post('/',isLoggedIn, createBrand)


module.exports = router;