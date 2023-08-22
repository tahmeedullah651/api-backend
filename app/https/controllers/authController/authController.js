const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../../../models/User");
const JwtService = require("../../../../Services/JwtServices");
const RefreshModel = require("../../../models/RefreshModel");
const DTOS = require("../../../../Services/DTOS");

function authController() {
    return {
        login: async (req, res) => {

            // validate the req
            const loginSchema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })

            const { error } = loginSchema.validate(req.body);
            if (error) {
                return res.status(422).json({ message: error.message });
            }

            // check useremail
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(422).json({ message: 'Email or password incorrect' });
            }

            // check user password using bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(403).json({ message: 'Email or password incorrect' });
            }
            const { accessToken, refreshToken } = JwtService.generateToken({ _id: user._id, role: user.role });


            const { result } = await JwtService.storeRefreshToken(refreshToken, user._id);
            if (!result) {
                return res.status(500).json({ message: 'Internal server error.Cannot store refresh token' });
            }

            // store  access token and refresh token in cookies
            res.cookie('refreshtoken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,// 1 day 
                httpOnly: true
            })

            res.cookie('accesstoken', accessToken, {
                maxAge: 1000 * 60 * 60, // 1 hour
                httpOnly: true
            })

            const userdata = DTOS.userDto(user);
            return res.json({ userdata });

        },
        register: async (req, res) => {
            // validate req using joi
            const registerSchema = Joi.object({
                fullName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string()
                    .pattern(new RegExp('^[a-zA-Z0-9]{5,15}$'))
                    .required()
                    .min(8)
                    .max(15)
                    .messages({
                        "string.pattern.base": "Password must include alphabets and numbers",
                        "string.min": "Password must be minimum 8 character required",
                        "string.max": "Password must be upto 15 characters "
                    }),
                confirmPassword: Joi.ref('password'),
                role: Joi.string().required(),
                town: Joi.string().required(),
                city: Joi.string().required(),
                province: Joi.string().required(),
                phone: Joi.string().trim().regex(/^((0)?)(3)([0-9]{9})$/).required()
            })
            const { error } = registerSchema.validate(req.body.values);
            if (error) {
                return res.status(422).json({ message: error.message });
            }

            // check if email has not register yet
            const { fullName, email, password, confirmPassword, phone, town, city, province, role } = req.body.values;
            if (role === 'admin' || role === 'Admin' || role === 'ADMIN') {
                return res.status(422).json({ message: 'Couldnot register user as admin' });
            }
            const user = await User.exists({ phone: phone });
            const userEmail = await User.exists({ email: email })
            if (userEmail) {
                return res.status(409).json({ message: 'Email already registered' });

            }
            if (user) {
                return res.status(409).json({ message: 'Phone number already registered' });
            }

            if (!fullName || !phone || !city || !town || !province || !email || !password || !confirmPassword || !role) {
                return res.status(422).json({ message: 'All fields are required' });
            }
            if (password !== confirmPassword) {
                return res.status(422).json({ message: 'Password not matching' });
            }


            try {
                // hash password
                const hashedPassword = await bcrypt.hash(password, 12);

                // register user
                const newUser = new User({
                    fullName,
                    email,
                    password: hashedPassword,
                    role,
                    city,
                    town,
                    province,
                    phone
                });

                const isSaved = await newUser.save();
                if (!isSaved) {
                    return res.status(500).json({ message: 'Internal server error.Could not register user' });
                }
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error.Please try again' })
            }

            return res.json({ message: 'All ok' });

        },
        logout: async (req, res) => {
            try {
                const token = await RefreshModel.findOneAndRemove({ userId: req.user._id });
                if (!token) {
                    return res.status(422).json({ message: 'Token not found' });
                }
                res.clearCookie('accesstoken');
                res.clearCookie('refreshtoken');
            } catch (err) {
                return res.status(500).json({ message: err.message });
            }
            return res.json({ message: 'Logout successfully' });
        },
        autoLogin: async (req, res) => {
            const { refreshtoken: refreshTokenFromCookies } = req.cookies;
            if (!refreshTokenFromCookies) {
                return res.status(401).json({ message: 'Token not found' });
            }
            let userData;
            try {
                userData = await JwtService.verifyRefreshToken(refreshTokenFromCookies);
            } catch (error) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            try {
                const token = await JwtService.findRefreshToken(userData._id, refreshTokenFromCookies);
                if (!token) {
                    return res.status(401).json({ message: 'Invalid Token' });
                }
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            const userExist = await User.findById(userData._id);
            if (!userExist) {
                return res.status(404).json({ message: 'Invalid user' });
            }

            const { accessToken, refreshToken } = JwtService.generateToken({ _id: userData._id, role: userData.role });
            try {
                const result = await JwtService.updateRefreshToken(userData._id, refreshToken);
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            // store  access token and refresh token in cookies
            res.cookie('refreshtoken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, //2 hour
                httpOnly: true
            })

            res.cookie('accesstoken', accessToken, {
                maxAge: 1000 * 60 * 60, // 1 hour
                httpOnly: true
            })
            const userdata = DTOS.userDto(userExist);
            return res.json({ userdata });
        },
        checkUserByPhone: async (req, res) => {
            try {
                const document = await User.findOne({ phone: req.body.phone })
                if (!document) {
                    return res.status(404).json({ message: 'Phone number not found' });
                }
                return res.json(document);
            } catch (error) {
                return res.status(500).json({ message: 'Internal server error' });
            }
        },
        updatePassword: async (req, res) => {
            try {
                const registerSchema = Joi.object({
                    password: Joi.string()
                        .pattern(new RegExp('^[a-zA-Z0-9]{5,15}$'))
                        .required()
                        .min(8)
                        .max(15)
                        .messages({
                            "string.pattern.base": "Password must include alphabets and numbers",
                            "string.min": "Password must be minimum 8 character required",
                            "string.max": "Password must be upto 15 characters "
                        }),
                    confirmPassword: Joi.ref('password'),
                    phone: Joi.string().trim().regex(/^((0)?)(3)([0-9]{9})$/).required()
                })
                const { error } = registerSchema.validate(req.body);
                if (error) {
                    return res.status(422).json({ message: error.message });
                }
                const { password, phone } = req.body;
                const hashedPassword = await bcrypt.hash(password, 12);

                const docs = await User.findOneAndUpdate({ phone: phone }, { password: hashedPassword }, { new: true });
                return res.status(200).json({ message: "Password updated successfully" });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal Server Error" });
            }

        },
        // admin: async (req, res) => {

        //     const password = "admin@123";

        //     try {
        //         // hash password
        //         const hashedPassword = await bcrypt.hash(password, 12);

        //         // register user
        //         const newUser = new User({
        //             fullName: "Yaseen Afridi",
        //             email: "yaseenafridi10875@gmail.com",
        //             password: hashedPassword,
        //             role: 'admin',
        //             city: 'Peshawer',
        //             town: 'Peshtakhara',
        //             province: 'Khyber Pukhtoon Khwa',
        //             phone: "03045760623"
        //         });

        //         const isSaved = await newUser.save();
        //         if (!isSaved) {
        //             return res.status(500).json({ message: 'Internal server error.Could not register user' });
        //         }
        //     } catch (error) {
        //         return res.status(500).json({ message: 'Internal server error.Please try again' })
        //     }

        //     return res.json({ message: 'All ok' });

        // },

    }
}

module.exports = authController;
