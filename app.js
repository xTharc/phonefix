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
//
mongoose.connect("mongodb://admin:PrOtoniXX10878@localhost:27017/nadeDB", {
  useNewUrlParser: true
});
// ----------------------------------MONGODB SCHEMAS AND MODULES----------------
const pageSchema = new mongoose.Schema ({
  mapname: String,
  content: String,


});
const ipSchema = new mongoose.Schema ({
  ip: String
});
const dataSchema = new mongoose.Schema ({
  spot: String,
  timesclicked: Number
});

const Mapp = new mongoose.model("Mapp", pageSchema);
const Ipp = new mongoose.model("Ipp", ipSchema);
const Dataa = new mongoose.model("Dataa", dataSchema);
//
//  var inputin = new Mapp({
//   mapname: "titan",
//   content: "",
//
//
// });
// inputin.save();

//-------------------------------------OUR APP----------------------------------


app.get("/", function(req, res) {



});

//  <%-map.content%>




//------------------------------------------------------------------------------
var server1 = app.listen(3000, function() {
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
