const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createJwtToken, sendEmail, generateDigitOtp } = require('../services/common.js')
const crypto = require('crypto');
const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None"
}


exports.createUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
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
        await sendEmail(email, 'Your One Time Password', "", `<h3><b>Your generated 6 digit otp is this ${await generateDigitOtp(6)}</b></h3>`);

        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user,
            token
        })

    } catch (e) {
        console.log('error creating user', e.message);
        return res.status(400).json({ success: false, message: e.message });
    }
}

exports.loginUser = async (req, res) => {
    console.log('i am inside login user backend');
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

        console.time('findingUser'); 
        const existingUser = await UserModel.findById(userId, 'email role address orders');
        console.timeEnd('findingUser');

        console.log("existingUser", existingUser);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            user: existingUser,
            token: req.user.token,
            success: true,
        })
    } catch (error) {
        console.log('error while checking auth');
        return res.status(500).json({
            success: false,
            message: 'Server error, please try again later',
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
        console.log('Error fetching users', err.message);
        return res.status(500).json({ success: false, message: err.message });

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
        console.log('unable to send the mail', e.message);
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }

}

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
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

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            })
        }

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user exist with this email',
            })
        }


        const resetToken = await user.createResetPasswordToken();
        await user.save();

        //send token via email
        const url = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`
        const subject = 'Reset Password Link';
        const text = "Your reset password link";
        const html = `<h3><b>Your reset password link is this <a href='${url}'> Reset Password Link</a>. You can click here to reset your password.<b/><h3></br>Remember the link is only valid till 15 mins.`
        const emailSend = await sendEmail(email, subject, text, html);
        if (emailSend) {
            return res.status(200).json({
                success: true,
                message: `Reset Link has been sent to ${email} `,
                token: resetToken
            })
        }

        return res.status(400).json({
            success: false,
            message: `Unable to send email at ${email}, please try later `,
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.resetPassword = async (req, res) => {
    const { resetPasswordToken } = req.params;
    const password = req.body.password;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'New password is required',
        })
    }
    if (!resetPasswordToken) {
        return res.status(400).json({
            success: false,
            message: 'Unable to find the reset password token',
        })
    }



    const hashedResetPasswordToken = await crypto.createHash('sha256').update(resetPasswordToken).digest("hex");

    const user = await UserModel.findOne({
        forgotPasswordToken: hashedResetPasswordToken,
        forgotPasswordExpiry: {
            $gt: Date.now(),
        }
    });




    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Unable to find the user',
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    user.password = undefined;

    return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        user: user
    })

}