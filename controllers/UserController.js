const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createJwtToken = require('../services/common.js')


const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None"
}


exports.createUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('fields missing');
        return res.status(400).json({
            message: 'Every field is required'
        })
    }
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered, Go and login"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            email,
            password: hashedPassword,
        })


        if (!user) {
            return res.status(500).json({
                success: false,
                message: `User registration failed, please try again later`
            });

        }

        const token = await createJwtToken(user.id, user.email);

        res.cookie('token', token, cookieOptions);
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user,
            token
        })

    } catch (e) {
        console.log('error creating user', e.message);
        return res.status(400).json({ message: e.message });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All the fields are required',
        })
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: `User doesn't exist`
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({
            success: false,
            message: 'Password is incorrect',
        });
    }

    const token = await createJwtToken(user.id, user.email);
    user.password = undefined;

    res.cookie('token', token, cookieOptions);
    return res.json({
        success: true,
        message: 'User loggedIn successfully',
        user,
        token: token
    });
}


exports.checkAuth = async (req, res) => {
    try {
        const userId = req.user.id;

        const existingUser = await UserModel.findById(userId);

        return res.status(200).json({
            user: existingUser,
            token: req.user.token,
            success: true,
        })
    } catch (error) {
        console.log("error while checking auth");
        return res.status(400).json({
            success: false,
            message: error
        })
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.cookie('token', null, {
            secure: true,
            expires: new Date(Date.now() + 0),
            httpOnly: true,
            sameSite: "none"
        }).status(200).json({
                success: true,
                message: 'User logged out successfully'
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to logg out'
        })
    }
}

exports.fetchAllUsers = async (req, res) => {
    const totalUsers = await UserModel.find({});

    try {
        return res.status(201).json({
            success: true,
            message: 'All users fetched successfully',
            users: totalUsers
        })
    } catch (err) {
        console.log('Error fetching users', err);
        return res.status(500).json({ message: 'Error fetching users' });

    }
}

exports.fetchUserById = async (req, res) => {
    const id = req.user.id;
    try {
        const user = await UserModel.findById(id);
        if (user) {
            return res.status(200).json({
                success: true,
                message: 'User found with the given id',
                user: user
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            success: false,
            message: e
        })
    }

}

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });    //{new:true} to view the new updated product not the old one
        if (user) {
            return res.status(200).json({
                success: true,
                message: 'User updated with the given id',
                user: user
            })
        }
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e
        })
    }

}

