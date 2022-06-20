var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
var Cryptojs = require('crypto-js');

const decryptKey = 'ayushTamboli';

/* GET Total Numbers of InfoType. */
router.get('/count', function (req, res, next) {

    db.query(`select info_type,count(info_type) as 'rowS' from mas_form where status=4 group by info_type`, function (err, result) {

        if (result && result.length > 0) {
            var count = new Array(result.length)

            for (var i = 0; i < result.length; i++) {
                count[i] = { [result[i].info_type]: result[i].rowS }
            }

            const mergedObj = count.reduce((r, c) => {
                return Object.assign(r, c)
            }, {})

            var resObj = {}
            resObj.Announcement = mergedObj.Announcement ? mergedObj.Announcement : 0
            resObj.Recruitment = mergedObj.Recruitment ? mergedObj.Recruitment : 0
            resObj.Tender = mergedObj.Tender ? mergedObj.Tender : 0
            resObj.Notice = mergedObj.Notice ? mergedObj.Notice : 0

            res.send(resObj)
        } else {
            res.send({
                Notice: 0,
                Recruitment: 0,
                Tender: 0,
                Announcement: 0
            })
        }
    });

});

//select form from ID
router.get('/selectForm/:form_id', (req, res, next) => {
    let id = req.params.form_id;
    // console.log(req.params.form_id)
    return db.query(`select * from mas_form where form_id='${id}'`, function (err, result) {
        // console.log(result);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(result);    
    })
})

// get data from mas_form
router.get('/pending', function (req, res, next) {
    // console.log('hello');
    return db.query(`select * from mas_form where status='1'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// get data from mas_form
router.get('/rejected', function (req, res, next) {
    // console.log('hello');
    return db.query(`select * from mas_form where status='3'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// get data from mas_form
router.get('/approved', function (req, res, next) {
    // console.log('hello');
    return db.query(`select * from mas_form where status='2' or status='4'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// get data from mas_form
router.get('/rejectedbyadmin', function (req, res, next) {
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

// approve Form Status Change 2
router.put('/approve/:form_id', function (req, res, next) {
    // console.log(req.params.form_id);
    let id = req.params.form_id;
    return db.query(`UPDATE mas_form SET status='2', wim_date=now() where form_id='${id}'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

// reject Form Status Change 3
router.put('/reject/:form_id', function (req, res, next) {
    // console.log(req.params.form_id);
    let id = req.params.form_id;
    return db.query(`UPDATE mas_form SET status='3', wim_date=now() where form_id='${id}'`, function (err, rows1) {
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
    // console.log(req.body.remark);
    // console.log(req.params.form_id);
    let id = req.params.form_id;
    return db.query(`UPDATE mas_form SET remark = '${req.body.remark}' where form_id='${id}'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

//wim password change
router.put('/changepass', function (req, res, next) {
    const { newPassword, username, oldPassword } = req.body
    db.query(`select password from mas_login where username='${username}'`, function (err, result) {
        if (result != undefined) {
            var OldPassword = Cryptojs.AES.decrypt(oldPassword, decryptKey).toString(Cryptojs.enc.Utf8)
            console.log(OldPassword);
            console.log(result[0].password)
            bcrypt.compare(OldPassword, result[0].password, (err, resp) => {
                
                if (resp) {
                    console.log('matched');
                    var NewPassword = Cryptojs.AES.decrypt(newPassword, decryptKey).toString(Cryptojs.enc.Utf8)

                    const saltRounds = 10;
                    bcrypt.hash(NewPassword, saltRounds, function (err, hash) {
                        return db.query(`UPDATE mas_login SET password = '${hash}' where username='${username}'`, function (err, rows1) {
                            // console.log(rows1);
                            if (err) {
                                return res.json(err);
                            }
                            return res.json(rows1);
                        });

                    });

                } else {
                    console.log('not matched')
                    res.send({affectedRows:0})
                }
            })
        }
    })

});

// update WIM profile
router.put('/updateProfile', function (req, res, next) {
    // console.log(req.params.form_id);
    const { officer_name, designation, email, mobile, deptName} = req.body
    return db.query(`UPDATE mas_dept SET officer_name ='${officer_name}', designation= '${designation}', email='${email}', mobile='${mobile}' where dept_name='${deptName}'`, function (err, rows1) {
        // console.log(rows1);
        if (err) {
            console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    });
});

router.get('/getProfile/:dept_name', function (req,res){
    let dept_name = req.params.dept_name
    return db.query(`select * from mas_dept where dept_name='${dept_name}'`,function(err, rows1){
        if (err) {
            // console.error('error connecting: ' + err);
            return res.json(err);
        }
        return res.json(rows1);
    } )

})

module.exports = router;
