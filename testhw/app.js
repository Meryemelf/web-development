const express = require("express");
const app = express();
const mysql =require("mysql");
const fs = require("fs");
let cors = require("cors");

app.use(cors());

//connect to the database
const db = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:"" ,
  database:'hw'
});

db.connect((error)=>{
  if(error){
    console.log(error);
  }else{
    console.log("MySl connected...");
  }
})
//end 
let rows;
//
app.set('view engine','hbs');
app.get("/", (req, res) => {
  db.query('SELECT name , fb FROM user', (err, rows) => {
    if (err) throw err;
    res.render('index', { users: rows });
  });
 

});
//Parse url encoded bordies (as send by html forms)
app.use(express.urlencoded({ extended : false}));
//parse json bordies (as send by api clients)
app.use(express.json());
const axios = require("axios");
app.post("/feedback/", (req, res) => {
  let question ;
  let ids;
  let title;
  let desc;
  let  q=[];
  let qs=[];
  const endpoint = 'https://my-json-server.typicode.com/depth0/survey1/surveys/1';
  if(req.body.OP== 'B'){
    endpoint = 'https://my-json-server.typicode.com/depth0/survey1/surveys/2';
  }
  
   axios.get(endpoint)
    .then((response) => {
      ids=response.data.id;
      title=response.data.title;
      desc=response.data.desc;
      q=response.data.qs;
      console.log(ids);
      console.log(title);
      console.log(desc);
      console.log(q);
      for(let i=0;i<q.length;i++){
       let n=q[i]
        question = 'https://my-json-server.typicode.com/depth0/survey1/questions/'.concat(n);
       console.log(question);
        axios.get(question)
      .then((respo) => {
       if(respo.data.type.'free'){
        qs.push({ id :respo.data.id, title:respo.data.title,des:respo.data.description,type : respo.data.type ,max:'' });
        }else{
          qs.push({ id :respo.data.id, title:respo.data.title,des:respo.data.description,type : 'number',max:'5' });
        }
  
      })
      .catch((error) => {
        console.log(error);
      });
      console.log( ids);
    console.log(title);
    console.log(desc);
    console.log(qs);
    }
    console.log( ids);
    console.log(title);
    console.log(desc);
    console.log(qs);
    })
    .catch((error) => {
      console.log(error);
    });

       
  const name=req.body.name;
  const email =req.body.email;
  const op =req.body.OP;
  const fb =req.body.fb;
  
  
  db.query("INSERT INTO `user` SET ? ",{name : name,email : email,selection: op,fb:fb},(error,results)=>{
    if(error){
      console.log(error);
    }else{


      res.render('index',{
        message:'ok',
        ids: ids,
        title:title,
        desc:desc,
        qs :qs,
        rows: rows
  

        
       });
    }
  

  });

 

});

app.listen(8080, ()=>{console.log("port 8080");
});
