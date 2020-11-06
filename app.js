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
//phoneDBNode:PrOtoniXX10878@
mongoose.connect("mongodb://phoneDBNode:PrOtoniXX10878@localhost:27017/phoneDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// ----------------------------------MONGODB SCHEMAS AND MODULES----------------
const phoneSchema = new mongoose.Schema ({
  phoneName: String,
  phonePic: String,
  fixTypes: [String],
  phonePrice: [String]
});
const tablicaSchema = new mongoose.Schema ({
  tabletName: String,
  tabletPic: String,
  fixTypes: [String],
  phonePrice: [String]
});
const repairOrder = new mongoose.Schema ({
  imeNarocnika: String,
  priimekNarocnika: String,
  telefonskaStevilka: Number,
  email: String,
  naslov: String,
  kraj: String,
  postnaStevilka: Number,
  dostava: String,
  Telefon: String,
  potrebnaPopravila: [String]
});

const Phones = new mongoose.model("Phones", phoneSchema);
const Tablets = new mongoose.model("Tablets", tabletSchema);
const Orders = new mongoose.model("Orders", repairOrder);

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
//  var inputin = new Phones({
//    phoneName: "iPhone 8S",
//    phonePic: "https://imgaz.staticbg.com/thumb/large/oaupload/banggood/images/A2/F5/587b03e3-bc3e-402e-bdbd-27d05b6620ad.jpg",
//    fixTypes: ["Popravilo Stekla","Menjava baterije"],
//    phonePrice: ["20","30"]
// });



//-------------------------------------OUR APP----------------------------------


app.get("/", function(req, res) {
  Phones.find({},function(err,foundPhones){

console.log(foundPhones);
      res.render("index", {
        phones: foundPhones
      });

});
});
var foundPhone;
var foundOrder;
app.get("/admin", function(req, res) {

  Phones.find({},function(err,foundPhones){
foundPhone = foundPhones;
console.log(foundPhones);
  });

Orders.find({},function(err,foundOrders){
foundOrder = foundOrders;
console.log(foundOrders);
  });

res.render("admin", {
  phones: foundPhone,
  orders: foundOrder
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

app.post("/", function(req, res) {
  var dostavaN;
if( req.body.address === "" ){
  dostavaN = "false";
} else {
  dostavaN = "true";
}

  const newOrder = new Orders({
    imeNarocnika: req.body.fname,
    priimekNarocnika: req.body.lname,
    telefonskaStevilka: req.body.phoneNum ,
    email: req.body.email,
    naslov: req.body.address,
    kraj: req.body.city,
    postnaStevilka: req.body.zip,
    dostava: dostavaN ,
    potrebnaPopravila: req.body.popravilo,
    Telefon: req.body.Imefona
    });

console.log(newOrder)
  newOrder.save();

 res.end('It worked!');
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
