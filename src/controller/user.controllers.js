
import { validateSignup ,validateLogin } from "../Validator/uservalidator.js"
import { userModel } from "../Models/usermodels.js"     
import bcryptjs from "bcryptjs"
import { generateTokens } from "../utils/generatetokens.js"

export const getHome =(req, res) => {
    res.send("This is the home route.")
}

export const getAbout =(req, res) => {
    res.send("This is the about route.")
}

export const postUser = async (req, res) => {
    const {username, email, password} = req.body

    try {
        const {error} = validateSignup.validate({
            username,
            email,
            password
        })

        if(error){
            return res.status(401).json({
                message: error.details[0].message
            })
        }
        
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(401).json({
                messagae: "user already exist, please login instead",
                data: existingUser
            })
        }
    
        const newUser = await userModel.create({
            username,
            email,
            password,
        })

        const token = await generateTokens(newUser._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    
        return res.status(201).json({
            message: "user created successfully!",
            data: newUser
        })
    } catch (error) {
        console.error(err)
        throw new Error(err)
    }
}


export const loginUser = async (req, res) =>{
    const {email, password} = req.body
    try {
        const {error} = validateLogin.validate({
            email,
            password
        })
        
        if(error){
            return res.status(401).json({
                message: error.details[0].message
            })
        }

        const existingUser = await userModel.findOne({email})
        
        if(!existingUser){
            return res.status(400).json({
                message: "user not found, please signup instead"
            })
        }
        const isPasswordMatch = await bcryptjs.compare(password, existingUser.password)
        if(!isPasswordMatch){
            return res.status(401).json({
                message: "invalid credentials"
            })
        }

        const token = await generateTokens(existingUser._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "user logged in successfully!",
            data: existingUser
        })
    } catch (error) {
        console.error(err)
        throw new Error(err)
    }
}

export const getSingleUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id).select("-password")

        if(!user){
            return res.status(404).json({
                message: "user does not exist"
            })
        }
    return res.status(200).json({
        message: "data fetched successfully!",
        data: user
    })
}catch(err) {
    console.error(err)
    throw new Error(err)
}
}

export const getAll = async (req, res) => {
    try {
        const users = await userModel.find().Sort({
            createdAt:-1
        }).select("-password")

        if(!users || users.length === 0) {
            return res.status(404).json({
                message: "No user found",
            })
        }

        return res.status(200).json({
            message:"user fetched",
            data: users
        })
    }catch(err) {
        console.error(err)
        throw new Error(err)
    }
}


export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const deletedUser = await userModel.findByIdAndDelete(id)
        if(!deletedUser){
            return res.status(404).json({
                message: "user not found"
            })
        }
        await res.clearCookie("token")

        return res.status(200).json({
            message: "Deleted!",
        })
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

export const getProfile = async (res, req) => {
    try{
        const user = req.user
        
        if(!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }

    return res.status(200).json({
        message: "Profile fetched succesfully",
        data: user
    })
    }catch(err) {
    console.error(err)
    throw new Error(err)
    }
}
