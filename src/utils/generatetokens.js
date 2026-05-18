import jwt from "jsonwebtoken" 

export const generateTokens = async (id) => {
    const token = await jwt.sign({id}, process.env.JWT_SECRET,
     {
        expiresIn: "7d"
    })

    return token;
}
