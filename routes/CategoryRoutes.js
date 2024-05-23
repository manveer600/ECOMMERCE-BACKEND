const {fetchCategories,createCategory} = require('../controllers/CategoryController.js')
const express = require('express');
const { isLoggedIn } = require('../middleware/Auth');

const router = express.Router();

router.get('/', isLoggedIn, fetchCategories);
router.post('/',isLoggedIn, createCategory);


module.exports = router;
