//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socket = require("socket.io");
const _ = require("lodash");
const app = express();
var nodemailer = require('nodemailer');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//phoneDBNode:PrOtoniXX10878@46.101.243.65
mongoose.connect("mongodb://phoneDBNode:PrOtoniXX10878@46.101.243.65:27017/phoneDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// ----------------------------------MONGODB SCHEMAS AND MODULES----------------
const phoneSchema = new mongoose.Schema({
  phoneBrand: String,
  phoneName: String,
  phonePic: String,
  fixTypes: [String],
  phonePrice: [String]
});
const tabletSchema = new mongoose.Schema({
  tabletBrand: String,
  tabletName: String,
  tabletPic: String,
  fixTypes: [String],
  phonePrice: [String]
});
const repairOrder = new mongoose.Schema({
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
// Phones.updateMany({}, {"$push": {fixTypes:"Menjava tipk"}},function(err, doc) {});
// Phones.updateMany({}, {"$push": {fixTypes:"Menjava konektorja"}},function(err, doc) {});
// Phones.updateMany({}, {"$push": {fixTypes:"Menjava slušalke"}},function(err, doc) {});
// Tablets.updateMany({}, {"$push": {fixTypes:"Menjava tipk"}},function(err, doc) {});
//Tablets.updateMany({}, {"$push": {fixTypes:"Menjava konektorja"}},function(err, doc) {});
// Tablets.updateMany({}, {"$pull": {fixTypes:"Menjava slušalke"}},function(err, doc) {});

// Tablets.updateOne({} , { "$pull": {fixTypes: "Menjava slušalke" } },function(err, doc) {});

//-------------------------------------OUR APP----------------------------------
var foundPhone;
var foundOrder;
var foundTablet;



app.get("", function(req, res) {


  Phones.find({}, function(err, foundPhones) {
    foundPhone = foundPhones;
    console.log(foundPhones);

    Tablets.find({}, function(err, foundTablets) {
      foundTablet = foundTablets;
      console.log(foundTablets);
      render();
    });


      function render() {
        res.render("index", {
          phones: foundPhone,
          tablets: foundTablet
        });
      }

  });




});



app.get("/admin", function(req, res) {

  Phones.find({}, function(err, foundPhones) {
    foundPhone = foundPhones;
    // console.log(foundPhones);
    Orders.find({}, function(err, foundOrders) {
      foundOrder = foundOrders;
      // console.log(foundOrders);

      res.render("admin", {
        phones: foundPhone,
        orders: foundOrder
      });
    });
    });

  });




app.post("/admin", function(req, res) {
  console.log("SUCK MY MASSIVE DONG");
  console.log(req.body.Choicee);

  if (req.body.Choicee == "Telefon") {
    const newPhone = new Phones({
      phoneBrand: req.body.Choicee2,
      phoneName: req.body.phoneName,
      phonePic: req.body.phonePic,
      fixTypes: req.body.fixTypes,
      phonePrice: req.body.fixPrice
    });

    newPhone.save();
  } else {
    const newTablica = new Tablets({
      tabletBrand: req.body.Choicee2,
      tabletName: req.body.phoneName,
      tabletPic: req.body.phonePic,
      fixTypes: req.body.fixTypes,
      phonePrice: req.body.fixPrice
    });

    newTablica.save();
  }

  res.redirect("/admin");
});

app.post("", function(req, res) {
  var dostavaN;
  if (req.body.address === "") {
    dostavaN = "false";
  } else {
    dostavaN = "true";
  }

  const newOrder = new Orders({
    imeNarocnika: req.body.fname,
    priimekNarocnika: req.body.lname,
    telefonskaStevilka: req.body.phoneNum,
    email: req.body.email,
    naslov: req.body.address,
    kraj: req.body.city,
    postnaStevilka: req.body.zip,
    dostava: dostavaN,
    potrebnaPopravila: req.body.popravilo,
    Telefon: req.body.Imefona
  });

  console.log(newOrder);
  newOrder.save();

  // ALSO Send Email when order
  var mailOptions = {
    from: req.body.email,
    to: 'info@applefix.si',
    subject: "Novo Naročilo na popravilo za " + req.body.Imefona,
    text: "Novo Naročilo od " + req.body.fname + " | " + req.body.lname + "\n|Telefon " + req.body.Imefona + "\n|Telefonska st. :" + req.body.phoneNum + "\n|" + req.body.email + "\n|Naslov:" + req.body.address + "\n|Kraj:" + req.body.city + "\n|PostnaŠt.:" + req.body.zip + "\n|Potrebna popravila: " + req.body.popravilo + "\n|Opombe: " + req.body.mailContent + "\nKONEC Naročila"
  };
  console.log(mailOptions);

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.end('It worked!');
});
app.post("/mail", function(req, res) {



  var mailOptions = {
    from: req.body.email,
    to: 'info@applefix.si',
    subject: req.body.title,
    text: req.body.mailContent
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });



  res.end('Mail sent');
});

app.post("/mojFon", function(req, res) {

  var mailOptions = {
    from: req.body.email,
    to: 'info@applefix.si',
    subject: req.body.phone,
    text: req.body.mailContent
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });



  res.end('Mail sent');
});



//  <%-map.content%>
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "h120.hitrost.net",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "info@applefix.si", // generated ethereal user
    pass: "Applefixadmin1", // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  },
});






//------------------------------------------------------------------------------
var server1 = app.listen(4000, function() {
  console.log("Server started on port 4000:");
});

//--------- ZA HITROST
// const server = app.listen(0, () => {
//     console.log('Example app listening at http://localhost:', server.address().port);
// });

//SOCKET SETUP
// var io = socket(server1);

// io.on('connection', function(socket) {
//   var address = socket.handshake.address;
//   console.log('New connection from ' + address);
//   Ipp.findOne({ip: address},function(err,foundIp){
//     if(foundIp){
//        console.log("IP already visited");
//     } else {
//       var inputIP = new Ipp({
//        ip: address
//      });
//      inputIP.save();
//     }
//
//
// });
//
// });
// CHECK
if (socket.connected) {
  console.log('socket.io is connected.')
} else {
  console.log('socket.io is DOWN.')
}
