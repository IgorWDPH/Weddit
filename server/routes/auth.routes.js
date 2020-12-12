const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const router = Router();

router.post(
    '/api/login',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Plese, enter password').exists()
    ],
    async (req, res) => {
        try {            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid login data1' });
            }
            const { email, password } = req.body;
            const user = await User.findOne({email: email});
            if(!user) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid login data2' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid login data3' });
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
    '/api/register',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password is too short, must be 8 symbols at least').isLength({ min: 8 })
    ],
    async (req, res) => {
        try {            
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid registration data' });
            }            
            const { email, password } = req.body;
            const candidate = await User.findOne({ email });
            if(candidate) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid registration data1' });   
            }            
            const hashedPassword = await bcrypt.hash(password, 12);            
            const user = new User({ email: email, password: hashedPassword });
            await user.save();
            res.status(201).json({message: 'User created'});
        }
        catch(e) {
            res.status(500).json({message: 'SORRY, WE SEEM TO HAVE BUNGLED SOMETHING...' + e.message});
            console.log(e.message);
        }
    }
);

module.exports = router;