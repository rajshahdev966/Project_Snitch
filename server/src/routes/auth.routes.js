import {Router} from "express"
import { loginController, registerController } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const router = Router();

/* 
    @POST /api/auth/register
    @description Register new user and assign access and refresh tokens
    @params req.body Object 
    @params req.email String
    @params req.password String 
    @params req.name String
    @params req.phoneNumber String
    @response res.status(201) [If registeration is successful]
*/

router.post("/register", registerValidator ,registerController);


/* 
    @POST /api/auth/login
    @description Login the existing user and assgin access and refresh token
    @params req.body = {email, password}
    @response res.status(200) [If login is successful]
*/

router.post("/login", loginValidator, loginController)

export default router;