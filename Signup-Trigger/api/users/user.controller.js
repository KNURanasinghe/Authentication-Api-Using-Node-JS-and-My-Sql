const {create, 
    getUserByUserId,
    getUsers,
    updateUsers,
    deleteUser,
    getUserByEmail} = require('./user.service');
const { genSaltSync, hashSync, compareSync} = require('bcrypt');
const { sign } = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// // Function to send welcome email
// const sendWelcomeEmail = (email) => {
//     // Create a Nodemailer transporter
//     let transporter = nodemailer.createTransport({
//         // Specify your email service provider
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//             // Provide your email credentials
//             user: process.env.MY_MAIL,
//             pass: process.env.APP_PASSWORD
//         }
//     });

//     // Email content
//     let mailOptions = {
//         from: process.env.MY_MAIL,
//         to: email,
//         subject: 'Welcome to Our Platform',
//         text: 'Welcome to our platform! Thank you for registering.'
//     };

//     // Send email
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// };
module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) =>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            // sendWelcomeEmail(body.email);
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Record not Found"
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    } ,
    getUsers: (req, res) =>{
        getUsers((err, results) =>{
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
        updateUsers: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUsers(body, (err, results) => {
           if(err){
            console.log(err);
            return false;
           }
           if(!results){
            return res.json({
                success: 0,
                message: "Faild to updata user"
            })
           }
           return res.json({
            success: 1,
            message: "update Successfully"
           })
        });
    },
    deleteUser: (req, res) => {
        const data = req.body;
        console.log(data);
        deleteUser(data, (err, results) =>{
            console.log(results);
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                });
            }
            return res.json({
                success: 1,
                message: "user deleted successfully"
            });
        });
    },
   login: (req, res) =>{
    const body = req.body;
    getUserByEmail(body.email, (err, results) =>{
        if(err){
            console.log(err);
        }
        if(!results){
            return res.json({
                success:0,
                data: "Invalid email or password"
            });
        }
        const result = compareSync(body.password, results.password);
        if(result){
            results.password = undefined;
            const jsontoken = sign({result: results},process.env.ENCRYPTED_TOKEN,{
                expiresIn: "1h"
            });
            return res.json({
                success: 1,
                message: "login successfully",
                token: jsontoken
            });
        } else{
            return res.json({
                success: 0,
                message: "Invalid email or password",
            });
        }
    });
   }
}