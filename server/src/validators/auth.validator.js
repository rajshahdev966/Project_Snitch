import { body, validationResult } from "express-validator";


export const registerValidator = [
    body("name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string"),
    body("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Enter a valid email address"),
    body("password")
        .exists().withMessage("Password is required").bail()
        .trim()
        .isLength({min: 8}).withMessage("Password must be longer than 6 character").bail()
        .isStrongPassword().withMessage("Must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character"),
    body("phoneNumber")
        .exists().withMessage("Phone Number is required").bail()
        .trim()
        .isMobilePhone(["en-IN"]).withMessage("Enter a valid phone number"),
    (req, res, next)=> {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid request",
                errors: errors.array()
            })
        }

        next();
    }
] 

export const loginValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Enter valid email address"),
    body("password")
        .exists().withMessage("Password is required").bail()
        .trim()
        .isStrongPassword().withMessage("Must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character"),
    (req, res, next)=> {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid data",
                errors: errors.array()
            })
        }

        next()
    }
]