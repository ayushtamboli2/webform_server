var express = require('express');
var app = express();
var db = require('../db');
var fs = require('fs')
//for upload pdf
multer = require('multer');
const DIR = './uploads/';
const path = require('path');


//get method
app.get('/deptName', (req, res) => {
  // console.log('Get All users');
  let qrr = `SELECT dept_name from mas_dept`;
  db.query(qrr, (err, results) => {
    if (err) {
      console.log(err, 'errs');
    }
    if (results.length > 0) {
      res.send({
        message: 'All users Data',
        data: results
      });
    };
  });
});



//Save Web-Form Data
app.post('/submit', function (req, res) {
  return db.query(`insert into mas_form (dept_name, info_type, eng_link,hindi_link,from_date,to_date,submited_by,designation,mobile,letter_pdf,soft_pdf,date,status) values (?,?,?,?,?,?,?,?,?,?,?,now(),'1')`, [req.body.dept_name, req.body.info_type, req.body.eng_link, req.body.hindi_link, req.body.from_date, req.body.to_date, req.body.submited_by, req.body.designation, req.body.mobile, req.body.letter_pdf, req.body.soft_pdf], function (err, rows1) {
    if (err) {
      console.error('error connecting: ' + err);
      return res.json(err);
    }
    return res.json(rows1);
  });
});


//Upload pdf or image file
let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if(file.fieldname=='letter')
      callback(null, './uploads/letter/');
      else
      callback(null, './uploads/soft/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({ storage: storage });

var multipleUpload = upload.fields([{name:"letter", maxCount:1},{name:"soft", maxCount:5}])

app.post('/file', multipleUpload, (req, res, next) => {
  let letter = ""
  let softCopy = ""
  for(let i=0; i< req.files.letter.length; i++) {
    letter += (i==req.files.letter.length-1)?req.files.letter[i].filename: req.files.letter[i].filename + "@";
  }
  for(let i=0; i< req.files.soft.length; i++) {
    softCopy += (i==req.files.soft.length-1)?req.files.soft[i].filename: req.files.soft[i].filename + "@";
  }
    
  res.json({file1: letter, file2: softCopy});
});


// get data from mas_form
app.get('/formdata', function (req, res, next) {
  // console.log('hello');
  return db.query('select * from mas_form', function (err, rows1) {
    // console.log(rows1);
    if (err) {
      // console.error('error connecting: ' + err);
      return res.json(err);
    }
    return res.json(rows1);
  });
});

// get user submitted data from mas_form  
app.get('/formList/:dept_name', function (req, res, next) {
  // console.log('hello');
  let dept_name = req.params.dept_name
  return db.query(`select * from mas_form where dept_name='${dept_name}'`, function (err, rows1) {
      // console.log(rows1);
      if (err) {
          // console.error('error connecting: ' + err);
          return res.json(err);
      }
      return res.json(rows1);
  });
});

// get user data from mas_form rejected
app.get('/rejectedList/:dept_name', function (req, res, next) {
  // console.log(req.params.dept_name);
  let dept_name = req.params.dept_name
  return db.query(`select * from mas_form where dept_name='${dept_name}' and status='3' or dept_name='${dept_name}'and status='5'`, function (err, rows1) {
      // console.log(rows1);
      if (err) {
          // console.error('error connecting: ' + err);
          return res.json(err);
      }
      return res.json(rows1);
  });
});

// get user data from mas_form approved by WIM 
app.get('/approvedList/:dept_name', function (req, res, next) {
  // console.log('hello');
  let dept_name = req.params.dept_name
  return db.query(`select * from mas_form where dept_name='${dept_name}' and status='2'`, function (err, rows1) {
      // console.log(rows1);
      if (err) {
          // console.error('error connecting: ' + err);
          return res.json(err);
      }
      return res.json(rows1);
  });
});

// get user data from mas_form uploaded by admin 
app.get('/uploadedList/:dept_name', function (req, res, next) {
  // console.log('hello');
  let dept_name = req.params.dept_name
  return db.query(`select * from mas_form where dept_name='${dept_name}' and status='4'`, function (err, rows1) {
      // console.log(rows1);
      if (err) {
          // console.error('error connecting: ' + err);
          return res.json(err);
      }
      return res.json(rows1);
  });
});

module.exports = app;