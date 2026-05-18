import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLenght: 100
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLenght: 10,
    }
},{timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next();
     const salt = await bcryptjs.genSalt(10)
     this.password = await bcryptjs.hash(this.password, salt)
})
export const userModel = mongoose.model("users", userSchema)
