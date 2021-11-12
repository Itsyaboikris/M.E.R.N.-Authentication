import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        const user = await User.create({username, email, password});
        sendToken(user, 201, res);
    } catch (e) {
        next(e);
        // res.status(500).json({
        //     success: false,
        //     error: e.message
        // });
    }

};

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return next(new ErrorResponse("Please provide and email and a password.", 400))
            //res.status(400).json({success:false, error:"Please provide email and password"})
        }

        const user = await User.findOne({email}).select("+password");

        if(!user) {
            return next(new ErrorResponse("Invalid credentials.", 401))
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch) {
            return res.status(404).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        sendToken(user, 200, res);

    } catch (e) {
        next(e);
        // res.status(500).json({
        //     success: false,
        //     error: e.message
        // });
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
         const {email} = req.body;

         const user = await User.findOne({email});

         if(!user) {
             return next(new ErrorResponse("Email could not be sent.", 404))
         }

         const resetToken = await user.getResetPasswordToken();

         await user.save();

         const resetUrl = `${process.env.API_URL}/resetPassword/${resetToken}`;

         const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this like to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
         `;

         try {
             await sendEmail({
                 to: user.email,
                 subject: "Password Reset Request",
                 text: message
             })
         }catch {
             user.resetPasswordToken = undefined;
             user.resetPasswordExpire = undefined;

             await user.save();
             return next(new ErrorResponse("Email could not be sent",500));
         }

         res.status(200).json({success: true, data: "Email Sent"});

    } catch (e) {
        return next(e);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        });

        if(!user) {
            return next(new ErrorResponse("Invalid Reset Token", 400))
        }

        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        return res.status(201).json({
            success: true,
            data: "Password Reset Success"
        })

    } catch (e) {
        next(e)
    }
};

const sendToken = async (user, statusCode, res) => {
    const token = await user.getSignedToken();

    res.status(statusCode).json({success: true, token});
};
