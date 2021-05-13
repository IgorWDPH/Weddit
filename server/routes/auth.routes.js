const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const email = require('../email/email');

const router = Router();

router.post(
    '/api/auth/login',
    [
        check('email_login', 'Invalid email').normalizeEmail().isEmail(),
        check('password_login', 'Plese, enter password').exists()
    ],
    async (req, res) => {
        try {            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid login data' });
            }
            const { email_login, password_login } = req.body;
            const user = await User.findOne({email: email_login});
            if(!user) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid login data - no user!' });
            }
            if(user.status === 1) {
                return res.status(400).json({ errors: errors.array(), message: 'User is not confirmed!' });
            }
            const isMatch = await bcrypt.compare(password_login, user.password);
            if(!isMatch) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid login data - wrong password!' });
            }
            const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), { expiresIn: '1h' });
            res.status(200).json({ token, userId: user.id });
        }
        catch(e) {
            res.status(500).json({message: 'SORRY, WE SEEM TO HAVE BUNGLED SOMETHING...' + e.message});
        }        
    }
);

router.post(
    '/api/auth/register',
    [
        check('nickname_register', 'Nickname is too short, it must be 6 symbols as min!').isLength({ min: 6 }),
        check('email_register', 'Invalid email').isEmail(),
        check('password_register', 'Password is too short, must be 8 symbols as min').isLength({ min: 8 })
    ],
    async (req, res) => {
        try {            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid registration data' });
            }            
            const { nickname_register, email_register, password_register, password_register_repeat } = req.body;
            const candidate = await User.findOne({ email: email_register });
            if(candidate) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid registration data - user already exists!' });   
            }
            if(password_register != password_register_repeat) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid registration data - passwords not much!' });
            }
            const hashedPassword = await bcrypt.hash(password_register, 12);
            const confirmationToken = jwt.sign({ userId: email_register }, config.get('jwtSecret'), { expiresIn: '1h' });
            const user = new User({nickname: nickname_register,
                                email: email_register,
                                password: hashedPassword,
                                status: 1,
                                confirmationCode: confirmationToken                                
                            });
            await user.save();
            email({
                recipientAddress: email_register,
                subject: 'Email Confirmation',
                template: 'email_confirmation',
                template_data: {
                    confirmationUrl: config.get('frontendUrl') + '/confirm/' + confirmationToken,
                    nickname: nickname_register
                }
            });
            res.status(201).json({message: 'User created'});
        }
        catch(e) {
            res.status(500).json({message: 'SORRY, WE SEEM TO HAVE BUNGLED SOMETHING...' + e.message});
            console.log(e.message);
        }
    }
);

router.post(
    '/api/auth/confirm',
    [
        check('code', 'There was no confirmation code provided!').isLength({ min: 1 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid code' });
            }
            const { code } = req.body;
            const user = await User.findOne({confirmationCode: code});
            if(!user) {                
                return res.status(400).json({ errors: errors.array(), message: 'There was no user registered with provided confirmation code!' });                
            }
            if(user.status === 0) {
                return res.status(400).json({ errors: errors.array(), message: 'User has been disabled!' });
            }
            user.status = 2;
            user.save();            
            res.status(201).json({message: 'User has been successfully activated!'});
        }
        catch(e) {
            res.status(500).json({message: 'SORRY, WE SEEM TO HAVE BUNGLED SOMETHING...' + e.message});
            console.log(e.message);
        }
    }
);

router.post(
    '/api/auth/reset_password_send_link',
    [
        check('email_reset_password', 'There was no email address provided!').isEmail(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid email' });
            }
            const { email_reset_password } = req.body;
            const user = await User.findOne({email: email_reset_password});            
            if(user) {
                const passwordResetCode = jwt.sign({ userId: email_reset_password }, config.get('jwtSecret'), { expiresIn: '1h' });
                user.passwordResetCode = passwordResetCode;
                user.save();
                email({
                    recipientAddress: email_reset_password,
                    subject: 'Password Reset',
                    template: 'password_reset',
                    template_data: {
                        passwordResetUrl: config.get('frontendUrl') + '/reset-password/' + passwordResetCode,
                        nickname: user.nickname
                    }
                });
            }
            res.status(201).json({message: `If there is an account associated with ${email_reset_password} you will receive an email with a link to reset your password.`});
        }
        catch(e) {
            res.status(500).json({message: 'SORRY, WE SEEM TO HAVE BUNGLED SOMETHING...' + e.message});
            console.log(e.message);
        }
    }
);

router.post(
    '/api/auth/reset_password',
    [        
        check('password_reset', 'Password is too short, must be 8 symbols as min').isLength({ min: 8 }),
        check('code', 'There was no reset code provided!').isLength({ min: 1 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid data' });
            }
            const { code, password_reset } = req.body;
            const user = await User.findOne({passwordResetCode: code});
            if(!user) {
                return res.status(400).json({ errors: errors.array(), message: 'No request found with this code!' });
            }

            user.passwordResetCode = '';            
            user.password = await bcrypt.hash(password_reset, 12);
            await user.save();
            email({
                recipientAddress: user.email,
                subject: 'Password Reset',
                template: 'password_reset_success',
                template_data: {
                    nickname: user.nickname
                }
            });
            
            res.status(201).json({message: 'It\'s done! Password has been reset'});
        }
        catch(e) {
            res.status(500).json({message: 'SORRY, WE SEEM TO HAVE BUNGLED SOMETHING...' + e.message});
            console.log(e.message);
        }
    }
);

module.exports = router;