const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
 
  service:'gmail',
  auth: {
    user: "becomming.fullstack.4@gmail.com",
    pass: "09914294120"
  }
});

const myMessage = {
  from: "becomming.fullstack.4@gmail.com",
  to: "wahidwex@gmail.com",
  subject: "Saeed mail sender sample from Node",
  text: "Have the most fun you can in a car. Get your Tesla today!"
};

function sendMail(message,callback){
  myMessage.text=message;
    transport.sendMail(myMessage,callback);
}

transport.sendMail(message, (err, info) => {
  if (err) {
    console.log("Error Email: " + err);
  } else {
    console.log(info);
  }
});

module.exports=sendMail;
