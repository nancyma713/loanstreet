import Validator from 'validator';
import validText from './valid-text';

function validateLoanInput(data) {
    let errors = {};

    data.amount = validText(data.amount) ? data.amount : "";
    data.interest_rate = validText(data.interest_rate) ? data.interest_rate : "";
    data.loan_length = validText(data.loan_length) ? data.loan_length : "";
    data.monthly_payment = validText(data.monthly_payment) ? data.monthly_payment : "";

    if (Validator.isEmpty(data.amount)) {
        errors.amount = "Amount field is required";
    }

    if (Validator.isEmpty(data.interest_rate)) {
        errors.interest_rate = "Interest Rate field is required";
    }

    if (Validator.isEmpty(data.loan_length)) {
        errors.loan_length = "Loan Length field is required";
    }

    if (Validator.isEmpty(data.monthly_payment)) {
        errors.monthly_payment = "Monthly payment field is required";
    }

    if (!Validator.isFloat(data.amount, { min: 0.01 })) {
        errors.amount = "Amount must be greater than $0.01";
    }

    if (!Validator.isFloat(data.loan_length, { min: 1 })) {
        errors.loan_length = "Loan Length must be greater than 1 month";
    }

    if (!Validator.isFloat(data.monthly_payment, { min: 0.01 })) {
        errors.monthly_payment = "Monthly Payment must be greater than $0.01";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}

export default validateLoanInput;