var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
var Cryptojs = require('crypto-js');

const decryptKey = 'ayushTamboli';

// get data from mas_dept
router.get('/dept', function (req, res, next) {
    return db.query('select * from mas_dept', function (err, rows1) {
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }

        return res.json(rows1);
    });
});

//get data from mas_role
router.get('/role', function (req, res, next) {
    return db.query('select * from mas_role', function (err, rows1) {
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }

        return res.json(rows1);
    });
});

// get data from mas_dept
router.get('/userdata', function (req, res, next) {
    return db.query('select ml.username,md.dept_name,mr.role_name from mas_login ml,mas_dept md,mas_role mr where ml.dept_id =md.dept_id and ml.role_code=mr.role_code and ml.username=ml.username', function (err, rows1) {
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// post data into mas_login
router.post('/adduser', function (req, res, next) {
    const { dept_id, role_code, username, password } = req.body
    var passwordData = Cryptojs.AES.decrypt(password, decryptKey);
    var passwordData = passwordData.toString(Cryptojs.enc.Utf8) //dycrypt by cryptojs
    // console.log(passwordData)
    const saltRounds = 10;
    bcrypt.hash(passwordData, saltRounds, function (err, hash) {
        req.body.passwordData = hash;
        // console.log(dept_id, role_code, username, req.body.passwordData) 
        return db.query(`insert into mas_login(dept_id, role_code, username, password) values(${dept_id},${role_code},'${username}','${hash}')`, function (err, rows1) {
            if (err) {
                console.error('error connecting: ' + err);
                return res.json(err);
            }
            return res.json(rows1);
        });
    });
});


//Add Department
router.post('/addDept', function (req, res, next) {
    console.log(req.body.dept_id)
    return db.query('insert into mas_dept (dept_name) value(?)', [req.body.dept_name], function (err, result) {
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }

        return res.json(result);
    })
})

//delete Department fron mas_dept Table
router.delete('/delete/:dept_id', (req, res, next) => {
    // console.log('hello')
    let id = req.params.dept_id;
    return db.query(`delete from mas_dept where dept_id='${id}'`, function (err, result) {
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }

        return res.json(result);
    })
})

//delete user fron mas_login Table
router.delete('/del/:username', (req, res, next) => {
    // console.log(req.params.username)
    let name = req.params.username;
    return db.query(`delete from mas_login where username='${name}'`, function (err, result) {
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(result);
    })
})

// get approved data from mas_form by WIM 
router.get('/pending', function (req, res, next) {
    // console.log('hello');
    return db.query(`select * from mas_form where status='2'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// approve Form Status Change 2
router.put('/upload/:form_id', function (req, res, next) {
    // console.log(req.params.form_id);
    let id = req.params.form_id;
    return db.query(`UPDATE mas_form SET status='4', admin_date=now() where form_id='${id}'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// reject Form Status Change 5
router.put('/reject/:form_id', function (req, res, next) {
    // console.log(req.params.form_id);
    let id = req.params.form_id;
    return db.query(`UPDATE mas_form SET status='5', admin_date=now() where form_id='${id}'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// get uploaded data from mas_form
router.get('/uploaded', function (req, res, next) {
    // console.log('hello');
    return db.query(`select * from mas_form where status='4'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// get rejected data from mas_form
router.get('/rejected', function (req, res, next) {
    // console.log('hello');
    return db.query(`select * from mas_form where status='5'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});


//remark
router.put('/remark/:form_id', function (req, res, next) {
    // console.log(req.body.admin_remark);
    // console.log(req.params.form_id);
    let id = req.params.form_id;
    return db.query(`UPDATE mas_form SET admin_remark = '${req.body.admin_remark}', status='5', admin_date=now() where form_id='${id}'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

router.post('/sendQuery',function (req,res,next) {
    if(req.body.queryDetail) {
        db.query(req.body.queryDetail,function (err, result) {
            if(result && result.length>0) {
                return res.json(result)
            } else {
                res.json(err)
            }            
        })
    } else {
        res.json({status:"Wrong Query"})
    }
    // db.query(req.body.queryDetail)
})


module.exports = router;