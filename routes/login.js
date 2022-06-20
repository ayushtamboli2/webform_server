const { request } = require('express');
var express = require('express');
var app = express();
var db = require('../db');
// const { request } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const CryptoJS = require('crypto-js');

const decryptKey = 'ayushTamboli';

//Login
app.post('/login', function (req, res) {

    const { username, dept_password, textCaptcha } = req.body
    pass = CryptoJS.AES.decrypt(req.body.dept_password, 'ayushTamboli').toString(CryptoJS.enc.Utf8);
    // console.log(req.body.dept_password)
    // console.log(pass);
    //Validation Check
    if (!username || !dept_password || !textCaptcha) {
        res.json({ success: false, token: 'Blank' });
    }
    //If valid Then show data From DataBase
    else {
        db.query('select ml.username,ml.password,md.dept_name,mr.role_code from mas_login ml,mas_dept md,mas_role mr where ml.dept_id =md.dept_id and ml.role_code=mr.role_code and ml.username=?', [username], (err, result) => {
            // res.json({result});
            //  console.log(result) 
            if (result.length>0) {
                bcrypt.compare(pass, result[0].password, (err, resp) => {
                    if (resp) {
                        // console.log(resp);
                        const jwttoken = jwt.sign(
                        {
                            username: result[0].username,
                            rolecode: result[0].role_code,
                            deptName: result[0].dept_name
                        }, 'key',
                        {
                            expiresIn: '1h'
                        }
                        
                        );
                        
                        return res.json({
                            token: jwttoken,
                            success: true
                        })
                    } else {
                        // console.log('not matched')
                        return res.json({
                            success: false,
                            token: 'Incorrect Password'
                        })

                    }

                })
            }else{
                return res.json({
                    success: false,
                    token: 'Incorrect Password'
                })
            }
        });
    }


})

// router.post('/login', function (req, res) {
//     var passwordData = CryptoJS.AES.decrypt(req.body.dept_password, decryptKey);
//     var password = passwordData.toString(CryptoJS.enc.Utf8);
//     // console.log()
//     res.send(req.body.username, req.body.textCaptcha, req.body.dept_password, password)
// })


app.get('/getdata', function (req, res) {
    db.query('select * from mas_login', (err, result) => {
        res.send(result)
    })
})


module.exports = app;
