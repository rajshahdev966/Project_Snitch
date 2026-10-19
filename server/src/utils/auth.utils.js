import jwt from "jsonwebtoken"
import config from "../config/config.js"


export const generateAccessToken = ({id, role})=> {
    const token = jwt.sign({id, role}, config.ACCESS_SECRET_TOKEN, {expiresIn: "15m"})
    return token
}
export const generateRefreshToken = ({id, role})=> {
    const token = jwt.sign({id, role}, config.REFRESH_SECRET_TOKEN, {expiresIn: "7d"})
    return token
}


export const readAccessToken = (token)=> {
    const decoded = jwt.verify(token, config.ACCESS_SECRET_TOKEN);

    return decoded
}

export const readRefreshToken = (token)=> {
    const decoded = jwt.verify (token, config.REFRESH_SECRET_TOKEN);

    return decoded
}