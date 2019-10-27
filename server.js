/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Mitchell Dsejardins Student ID: 059863126 Date: October 10, 2019
*
* Online (Heroku) Link: https://glacial-atoll-38410.herokuapp.com/
*
********************************************************************************/ 

let express = require("express");
let app = express();
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
let path = require('path');
let dataService = require("./data-service.js");

let HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

function onHttpStart(){
    console.log(`Express http server listening on ${HTTP_PORT}`);
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/employees/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.get("/images/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.get("/employees", (req, res) => 
{
    if (req.query.status) 
    {
        dataService.getEmployeesByStatus(req.query.status)
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    } else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    } else {
        dataService.getAllEmployees()
        .then((data) => {res.json(data);})
        .catch((err) => {res.json({ message: "no results" });});
    }
});

app.get("/managers", function(req,res){
    dataService.getManagers()
    .then((data) => res.json(data))
    .catch((err) => res.json({"message": err}))
});

app.get("/departments", function(req,res){
    dataService.getDepartments()
    .then((data) => res.json(data))
    .catch((err) => res.json({"message": err}))
});

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", (err, items) => {
      res.render("images", { data: items });
    });
  });

  app.post("/employees/add", (req, res) => 
  {
    dataService.addEmployee(req.body)
    .then(()=>{ res.redirect("/employees");});
  });

  app.get("/employee/:empNum", (req, res) => 
{
    dataService.getEmployeeByNum(req.params.empNum)
    .then((data) => {res.json(data);})
    .catch((err) => { res.json({message:"no results"});});
});

app.use((req, res) => {
    res.status(404);
    res.redirect("https://cdn-images-1.medium.com/max/800/1*dMtM0XI574DCyD5miIcQYg.png");
});

//this was causing my path problem ... OOPS
//app.get()

dataService.initialize().then(() => {app.listen(HTTP_PORT, onHttpStart);}).catch(()=>{console.log(`There was an issue`);});
