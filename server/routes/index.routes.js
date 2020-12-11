const { Router } = require('express');

const router = Router();

router.get(
    '/',
    async (req, res) => {
        res.status(200).send('Lorem Ipsum Dolor Sit Amet');
    }
);

module.exports = router;