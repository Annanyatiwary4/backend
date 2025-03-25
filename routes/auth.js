import { Router } from 'express';
import { User, validate } from '../models/users.js';
import bcrypt from 'bcrypt';

const router = Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const users = await User.findOne({ email: req.body.email });
        if (users) return res.status(400).send({ message: 'User already registered' });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashedPassword }).save();
        res.status(201).send({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

export default router;
