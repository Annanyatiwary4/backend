import { Router } from 'express';
import { User, validate } from '../models/users.js';
import bcrypt from 'bcrypt';

const router = Router();

// Login Route
router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const users = await User.findOne({ email: req.body.email });
        if (!users) return res.status(401).send({ message: 'Invalid Email or Password' });

        const validPassword = await bcrypt.compare(req.body.password, users.password);
        if (!validPassword) return res.status(401).send({ message: 'Invalid Email or Password' });

        const token = users.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in Successfully!!" });

    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

export default router;
