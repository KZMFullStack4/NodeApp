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
  to: "becomming.fullstack.4@gmail.com",
  subject: "Saeed mail sender sample from Node",
  text: "Have the most fun you can in a car. Get your Tesla today!"
};

async function sendMail(from,to,subject,text,html){
  let emailUtil={
    from:from,
    to:to,
    subject:subject,
    text:text,
    html:html
  }
    return transport.sendMail(emailUtil);
}



module.exports=sendMail;
