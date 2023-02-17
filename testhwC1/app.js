const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require("fs");

const cors = require('cors');
const axios = require('axios');

app.use(cors());

// Connect to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hw',
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('MySQL connected...');
  }
});

let rows;

// Set the view engine
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  db.query('SELECT name, fb FROM user ORDER BY id desc', (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('index', { users: rows });
  });
});

// Parse url encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: false }));

// Parse json bodies (as sent by api clients)
app.use(express.json());
//
let surveyData;

fs.readFile('surveys.json', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    surveyData = JSON.parse(data);
  }
});

app.get('/surveys/:id', (req, res) => {
  const survey = surveyData.find((s) => s.id === parseInt(req.params.id));
  if (survey) {
    res.send(survey);
  } else {
    res.status(404).send('Survey not found');
  }
});
//end
//
let questionsData;

fs.readFile('questions.json', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    questionsData = JSON.parse(data);
  }
});

app.get('/questions/:id', (req, res) => {
  const question = questionsData.find((q) => q.id === parseInt(req.params.id));
  if (question) {
    res.send(question);
  } else {
    res.status(404).send('question not found');
  }
});
app.post('/feedback/', (req, res) => {
  const submitSource = req.body['submit-source'];
  if (submitSource === 'auto') {
    let question;
    let ids;
    let title;
    let desc;
    let q = [];
    let qs = [];
    const endpoint =
    req.body.OP === 'B'
      ? 'http://localhost:7080/surveys/2'
      : 'http://localhost:7080/surveys/1';
      axios
      .get(endpoint)
      .then((response) => {
        const data = response.data;
        ids = data.id;
        title = data.title;
        desc = data.desc;
        q = data.qs;
        console.log(response.data);
        const fetchData = async () => {
          for (let i = 0; i < q.length; i++) {
            const n = q[i];
            question = `http://localhost:7080/questions/${n}`;
  
            try {
              const respo = await axios.get(question);
              if (respo.data.type === 'free') {
                qs.push({
                  id: respo.data.id,
                  title: respo.data.title,
                  des: respo.data.description,
                  type: 'text',
                  max: '',
                });
              } else {
                qs.push({
                  id: respo.data.id,
                  title: respo.data.title,
                  des: respo.data.description,
                  type: 'number',
                  max: '5',
                });
              }
            } catch (error) {
              console.log(error);
            }
          }
  

  
        
                // Execute SELECT query to get the inserted record
                db.query(
                  'SELECT name, fb FROM user ORDER BY id ASC',
                  
                  (err, rows) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.render('index', {
                        name:req.body.name,
                        email:req.body.email,
                        fb:req.body.fb,
                        OP : req.body.OP,
                        message: 'ok',
                        ids,
                        title,
                        desc,
                        qs,
                        users: rows
                      });
                    }
                  }
                );
         
        };
  
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });

  } else if (submitSource === 'manual') {
    const name = req.body.name;
    const email = req.body.email;
    const op = req.body.ckr;
    const fb = req.body.fb;
    const r_e =req.body.r_e;
    const c_desc=req.body.c_desc;
    const  r_c=req.body.r_c;
    const  r_org=req.body.r_org;
    const  c_d=req.body.r_d;
    const   r_ed=req.body.r_ed;

    db.query(
      'INSERT INTO `user` SET ? ',
      { name: name, email: email, selection: op, fb: fb },
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
         /* if(op=='S'){
            db.query(
              'INSERT INTO `feedback_s` SET ? ',
              { R_education: r_e, C_desc: c_desc, idu: results.insertId },
              (er, r) => {if(er) {console.log(er);}else{
                db.query(
                  'SELECT name, fb FROM user ORDER BY id ASC',
                  [results.insertId],
                  (err, rows) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.render('index', {
                        message: 'ok',
                        ids,
                        title,
                        desc,
                        qs,
                        users: rows
                      });
                    }
                  }
                );
          }
        });
          }else{
            db.query(
              'INSERT INTO `feedback_b` SET ? ',
              { R_Sar_C: r_c, R_Sat_Org: r_org, R_Ed:r_ed,C_desc: c_d , idu: results.insertId },
              (er, r) => {if(er) {console.log(er);}else{
                db.query(
                  'SELECT name, fb FROM user ORDER BY id ASC',
                  [results.insertId],
                  (err, rows) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.render('index', {
                        message: 'ok',
                        ids,
                        title,
                        desc,
                        qs,
                        users: rows
                      });
                    }
                  }
                );
          }
        });
          }
         */
         // Execute SELECT query to get the inserted record
         db.query(
          'SELECT name, fb FROM user ORDER BY id desc',
          [results.insertId],
          (err, rows) => {
            if (err) {
              console.log(err);
            } else {
              res.render('index', {
              users: rows
              });
            }
          }
        );
        }
      }
    );
  }




});


app.listen(7080, () => {
  console.log('Port 7080');
});
