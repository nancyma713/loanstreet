import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Amount in USD
// Interest rate as a percentage to two decimal places
// Loan length in months
// Monthly payment in USD

const LoanSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    interest_rate: {
        type: Number,
        required: true
    },
    loan_length: {
        type: Number,
        required: true
    },
    monthly_payment: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Loan', LoanSchema);