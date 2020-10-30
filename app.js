//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socket = require("socket.io");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//mongodb://admin:PrOtoniXX10878@localhost:27017/nadeDB
mongoose.connect("mongodb://localhost:27017/phoneDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// ----------------------------------MONGODB SCHEMAS AND MODULES----------------
const phoneSchema = new mongoose.Schema ({
  phoneName: String,
  phonePic: String,
  fixTypes: [String],
  phonePrice: [String],
  order: String
});
const Phones = new mongoose.model("Phones", phoneSchema);

// const ipSchema = new mongoose.Schema ({
//   ip: String
// });
// const dataSchema = new mongoose.Schema ({
//   spot: String,
//   timesclicked: Number
// });
//
//const Mapp = new mongoose.model("Mapp", pageSchema);
// const Ipp = new mongoose.model("Ipp", ipSchema);
// const Dataa = new mongoose.model("Dataa", dataSchema);
// //
 var inputin = new Phones({
   phoneName: "iPhone 8S",
   phonePic: "https://imgaz.staticbg.com/thumb/large/oaupload/banggood/images/A2/F5/587b03e3-bc3e-402e-bdbd-27d05b6620ad.jpg",
   fixTypes: ["Popravilo Stekla","Menjava baterije"],
   phonePrice: ["20","30"]
});



//-------------------------------------OUR APP----------------------------------


app.get("/", function(req, res) {
  Phones.find({},function(err,foundPhones){

console.log(foundPhones);
      res.render("index", {
        phones: foundPhones
      });

});
});

app.get("/admin", function(req, res) {
  Phones.find({},function(err,foundPhones){

console.log(foundPhones);
      res.render("admin", {
        phones: foundPhones
      });

});
});

app.post("/admin", function(req, res) {
  const newPhone = new Phones({
    phoneName: req.body.phoneName,
    phonePic: req.body.phonePic,
    fixTypes: req.body.fixTypes,
    phonePrice: req.body.fixPrice
    });

  newPhone.save();

  res.redirect("/admin");
});



//  <%-map.content%>




//------------------------------------------------------------------------------
var server1 = app.listen(4000, function() {
  console.log("Server started on port 3000");
});

//SOCKET SETUP
var io = socket(server1);

io.on('connection', function(socket) {
  var address = socket.handshake.address;
  console.log('New connection from ' + address);
  Ipp.findOne({ip: address},function(err,foundIp){
    if(foundIp){
       console.log("IP already visited");
    } else {
      var inputIP = new Ipp({
       ip: address
     });
     inputIP.save();
    }


});

});
// CHECK
if (socket.connected) {
  console.log('socket.io is connected.')
} else {
  console.log('socket.io is DOWN.')
}
