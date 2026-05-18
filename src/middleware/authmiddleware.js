import jwt from "jsonwebtoken" 

const secret = process.env.JWT_SECRET

export const checkToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message: "Token not found, signup or login"
            })
        }
        const decodedToken = jwt.verify(token, secret)
        if(!decodedToken){
            return res.status(401).json({
                message: "unauthorized"
            })
        }
        req.user = decodedToken
        next()
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}       