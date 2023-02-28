//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017//todolistDB");
// connect to MongoDB, specify url where mongoDB database is located which is always localhost, then
// specify name of DB

const itemsSchema = { //item schema, model will be based on item schema
  name: String
};

const Item = new mongoose.model("Item", itemsSchema); // mongoose model

const item1 = new Item({
  name: "welcome to your to do list"
});

const item2 = new Item({
  name: "hit the + button to add an item"
});

const item3 = new Item({
  name: "<-- hit the delete to remove an item"
});

const defaultItems = [item1, item2, item3]; // new array to store item

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {

  const day = date.getDate();

  Item.find({}, function(err, foundItems){

    if(foundItems === 0){
      Item.insertMany(defaultItems, function(error, docs) {});
      res.redirect("/");
    } else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });

});


// This happens in our post route and that is when we decide to add a new item and we trigger the form
// to post to our root route which gets caught in here and we try to grab the item that the user tried

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");

});

app.post("/delete", function(req, res){

  const checkedItemID = req.body.checkbox; // item being sent from form

  Item.findByIdAndDelete(checkedItemID, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Deleted : ", docs);
          res.redirect("/");
      }
  });
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
