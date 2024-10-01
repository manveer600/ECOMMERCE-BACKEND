const express = require('express');
const { createUser, fetchAllUsers, fetchUserById, updateUser, loginUser, logoutUser,checkAuth, forgotPassword, resetPassword, generateOTP } = require('../controllers/UserController.js');
const { isLoggedIn } = require('../middleware/Auth');

const router = express.Router();
router.post('/signup', createUser);
router.get('/check-auth', isLoggedIn ,checkAuth);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:resetPasswordToken', resetPassword);
router.get('/logout',isLoggedIn, logoutUser);
router.get('/', isLoggedIn, fetchAllUsers);
router.get('/own', isLoggedIn, fetchUserById);
router.patch('/:id', isLoggedIn, updateUser);
router.post('/generateOTP', generateOTP);


module.exports = router;
