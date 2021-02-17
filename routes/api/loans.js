import express from 'express';
const router = express.Router();
import passport from 'passport';

import Loan from '../../models/Loan';
import validateLoanInput from '../../validation/loans';

router.get('/', (req, res) => {
    Loan.find()
        .then(loans => res.json(loans))
        .catch(err => res.status(404).json({ noloanfound: 'No loan found' }));
});

router.get('/:userId', (req, res) => {
    Loan.find({ userId: req.params.user_id })
        .then(loans => res.json(
            loans.map(loan => {
                return {
                    amount: loan.amount,
                    interest_rate: loan.interest_rate,
                    loan_length: loan.loan_length,
                    monthly_payment: loan.monthly_payment,
                    id: loan.id,
                }
            })
        ))
        .catch(err => res.status(404).json({ noloansfound: 'No loans found from that user' }));
});

router.get('/:id', (req, res) => {
    Loan.findById(req.params.id)
        .then(loan => res.json(loan))
        .catch(err => res.status(404).json({ noloanfound: 'No loan found with that ID' }));
});

router.post('/new',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateLoanInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const newLoan = new Loan({
            amount: req.body.amount,
            interest_rate: req.body.interest_rate,
            loan_length: req.body.loan_length,
            monthly_payment: req.body.monthly_payment,
            user_id: req.user.id
        });

        newLoan.save()
            .then(loan => res.json(loan));
    }
)

router.put("/:id",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Loan.findOneAndUpdate(
            { _id: req.body.id },
            {
                amount: req.body.amount,
                interest_rate: req.body.interest_rate,
                loan_length: req.body.loan_length,
                monthly_payment: req.body.monthly_payment
            },
            { upsert: true },
            (err, data) => {
                if (err) res.json(err);
                res.json(req.loan);
            }
        );
    }
);

export default router;