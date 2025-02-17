import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import keys from '../../config/keys';
import passport from 'passport';
import mongoose from 'mongoose';

import validateRegisterInput from '../../validation/register';
import validateLoginInput from '../../validation/login';

mongoose.set("useFindAndModify", false);

router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = "User already exists";
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                const payload = { id: user.id, email: user.email };

                                // jwt.sign(
                                //     payload,
                                //     keys.secretOrKey,
                                //     { expiresIn: 3600 },
                                //     (err, token) => {
                                //         res.json({
                                //             success: true,
                                //             token: "Bearer" + token
                                //         });
                                //     });
                            })
                            .catch(err => console.log(err));
                    })
                })
            }
        })
})

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = "This user does not exist";
                return res.status(400).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, email: user.email };

                        // jwt.sign(
                        //     payload,
                        //     keys.secretOrKey,
                        //     { expiresIn: 3600 },
                        //     (err, token) => {
                        //         res.json({
                        //             success: true,
                        //             token: "Bearer " + token
                        //         });
                        //     }
                        // );
                    } else {
                        errors.password = "Incorrect password";
                        return res.status(400).json(errors);
                    }
                })
        })
})

router.get('/current', (req, res) => {
    const email = req.body.email;
    User.findOne({ email })
        .then(user => res.json(user))
        .catch(err => res.status(404).json({ nouserfound: 'No user found' }));
});

export default router;