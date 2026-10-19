import userModel from "../models/auth.model.js";
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken, readAccessToken, readRefreshToken,  } from "../utils/auth.utils.js";

export const registerController = async (req, res)=> {
    const {name, email, password, phoneNumber} = req.body;

    const isEmailAlreadyExist = await userModel.findOne({email});

    const isPhoneAlreadyExist = await userModel.findOne({phoneNumber});

    if(isEmailAlreadyExist){
        return res.status(400).json({
            message: "User with same email already exists",
            errors: {
                path: "email",
                msg: "User with same email already exist"
            }
        })
    }
    if(isPhoneAlreadyExist){
        return res.status(400).json({
            message: "User with same number already exists",
            errors: {
                path: "phoneNumber",
                msg: "User with same phone number already exist"
            }
        })
    }

    const user = await userModel.create({
        name, email, passwordHash: await bcrypt.hash(password, 12), phoneNumber
    });

    const accessToken = generateAccessToken({id: user._id, role: user.role});

    const refreshToken = generateRefreshToken({id: user._id, role: user.role});

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })

    await userModel.findByIdAndUpdate(user._id, {refreshToken});

    return res.status(201).json({
        message: "User created successfully",
        data: {
            user:{
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
            accessToken
        }
    });
}


export const loginController = async (req, res)=> {
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if(!isValidPassword){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const accessToken = generateAccessToken({id: user._id, role: user.role});
    const refreshToken = generateRefreshToken({id: user._id, role: user.role});

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })
    await userModel.findOneAndUpdate({email}, {refreshToken});

    return res.status(201).json({
        message: "User logged in successfully",
        data: {
            user: {
                email, name
            },
            accessToken
        }
    })

}



const refreshController = async (req, res)=> {
    const {refreshToken} = req.cookies

    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh Token is required",
            errors: {
                path: "refreshToken",
                msg: "Refresh Token is required"
            }
        })
    }

    try {

        const decoded = readRefreshToken(refreshToken);

        const {id, role} = decoded;

        const user = await userModel.findById(id);

        if(!user){
            return res.status(400).json({
            message: "Invalid refresh Token"
        })
        }


        if(user.refreshToken != refreshToken){
            await userModel.findByIdAndUpdate(user._id, {refreshToken: null});

            return res.status(401).json({
                message: "Refresh Token mismatch",
                errors: {
                    path: "refreshToken",
                    msg: "Refresh Token mismatch"
                }
            })
            
        }

        const accessToken = generateAccessToken({iid: user._id, role: user.role})
        const newRefreshToken = generateRefreshToken({id: user._id, role: user.role})

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true
        })

        await userModel.findByIdAndUpdate(user._id, {refreshToken: newRefreshToken})

        return res.status(200).json({
            message: "Tokens refresh successfully",
            data: {
                user: {
                    email: user.email,
                    name: user.name 
                },
                accessToken
            }
        })
        
    } catch (error) {
        return res.status(400).json({
            message: "Invalid refresh Token"
        })
    }


}