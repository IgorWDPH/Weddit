const { Router } = require('express');

const router = Router();

router.post(
    '/api/login',
    async (req, res) => {
        res.status(200).json({ 'test': 'from api/login' });
    }
);

module.exports = router;