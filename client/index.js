const axios = require('axios');

async function main() {
    const user1 = {
        email: "user1@gmail.com",
        password: "password123",
    };

    const user2 = {
        email: "user2@gmail.com",
        password: "password123"
    };

    let currUserId;

    // Create loan
    const currUser = await axios({
        method: 'get',
        url: '/api/users/current',
        data: { email: user2.email },
        baseURL: "http://localhost:5000"
    })

    currUserId = currUser.data._id;

    const loan1 = {
        userId: currUserId,
        amount: 2000,
        interest_rate: 0.02,
        loan_length: 12,
        monthly_payment: 200
    }

    let currLoanId; 

    console.log("Creating loan...");

    const res = await axios({
        method: 'post',
        url: '/api/loans/new',
        data: loan1,
        baseURL: "http://localhost:5000"
    })
    
    console.log("Loan created!");
    currLoanId = res.data._id;

    // // Get loan
    await axios({
        method: 'get',
        url: `/api/loans/${currLoanId}`,
        baseURL: "http://localhost:5000"
    })
        .then((res) => {
            console.log("Loan Data:");
            console.log(res.data);
        })
        .catch((err) => console.log(err.response.data));

    // Update loan
    const updatedLoan = {
        amount: 10000,
        interest_rate: 0.02,
        loan_length: 12,
        monthly_payment: 1000
    }

    console.log("Updating loan...");

    await axios({
        method: 'put',
        url: `/api/loans/${currLoanId}`,
        data: updatedLoan,
        baseURL: "http://localhost:5000"
    })
        .then((res) => console.log(`Updated loan!`))
        .catch((err) => console.log(err.response.data));

    
    // Get new loan
    await axios({
        method: 'get',
        url: `/api/loans/${currLoanId}`,
        baseURL: "http://localhost:5000"
    })
        .then((res) => {
            console.log("Loan Data:");
            console.log(res.data);
        })
        .catch((err) => console.log(err.response.data));
}

main();