const express = require("express");
const app = express();
const fs = require("fs");
let cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World from express!</h1>");
});


const axios = require("axios");
app.get("/surveys/:id", (req, res) => {
  const endpoint = `https://my-json-server.typicode.com/depth0/survey1/surveys/${req.params.id}`;
  axios
    .get(endpoint)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

// for questions ID
app.get("/questions/:id", (req, res) => {
  const endpoint = `https://my-json-server.typicode.com/depth0/survey1/questions/${req.params.id}`;
  axios
    .get(endpoint)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});




app.listen(8080, ()=>{console.log("port 8080");
});