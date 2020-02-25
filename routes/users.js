const express = require("express");
const router = express.Router();
require('dotenv').config();
const db = require("../config/database");
const User = require("../models/user").User;
const SECRET_KEY = "SECRET_KEY IS HERE FOR AUTHORIZATION PURPOSES";
const createUser = require("../models/user");
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let result = createUser.createUser;

console.log("Result of creation" + result);



router.post("/register", async (req, res, next) => {
  const hashedPassword = await bCrypt.hash(req.body.password, 10);

  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: hashedPassword
  })
    .then(user => {
      // Send created user to client
      res.status(200).send("Saved : " + JSON.stringify(user));
    })
    .catch(function(err) {
      console.log("create failed with error: " + err);
      res.send("Error : " + err);
    });
});

router.delete("/delete/:id", (req, res, next) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(function() {
      console.log("Deleted"); // { '0': 0 } - why not same as in bulkUpdate?
    })
    .cath(err => {
      console.log("err");
    });
});

router.post("/protected-2", verifyToken, (req, res) => {
  console.log("Here protected ");

  res.json({
    verified: true,
    message: "Here is protected 2 ",
    mainresponse: req.main
  });
  console.log("Main response : " + req.main);
});

router.post("/protected-posts", verifyToken, anotherHandler, (req, res) => {
  console.log("Here protected ");

  res.json({
    verified: true,
    message: "message here ",
    mainresponse: {
      name: "ali",
      family: "Kazmi",
      tokenInNext: req.token,
      anotherHandler: req.anotherHandler
    }
  });
  console.log("tokenInNext: " + req.token);
});

//Serial midleware functions here
function anotherHandler(req, res, next) {
  if (typeof req.token !== "undefined") {
    req.anotherHandler = "Set another handler";
    next();
  } else {
    //Forbidden
    res.send("Error in another handler function");
  }
}

function verifyToken(req, res, next) {
  let token = req.headers.authorization;
  if (typeof token !== "undefined") {
    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (!err) {
        req.main = data;
        next();
      } else {
        res.json({
          error: true,
          message: "Token invalid"
        });
      }
    });
  } else {
    //Forbidden
    res.sendStatus(403);
  }
}

let myUser = [];
router.get("/get-all", async (req, res, next) => {
  let users = await User.findAll()
    .then(data => {
      console.log("Get ALl successfull : " + JSON.stringify(data));
      res.send("Success" + JSON.stringify(data));

      this.myUser = data;
      // console.log("Users array : " +JSON.stringify(users));
    })
    .catch(err => {
      console.log("err" + err);
    });
});
// console.log(users.every(user => user instanceof User)); // true
// console.log("All users:", JSON.stringify(users, null, 2))

router.put("/update/:id", function(req, res, next) {
  console.log("Params id: " + req.params.id);
  console.log("Req body :  " + JSON.stringify(req.body));

  User.update(
    { firstName: req.body.firstname, lastName: req.body.lastname },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(function(rowsUpdated) {
      res.json(rowsUpdated);
    })
    .catch(err => {
      console.log("Error : " + err);
    });
});

router.get("/get-one/:id", (req, res, next) => {
  User.findByPk(req.params.id)
    .then(data => {
      console.log("Was successfull : " + JSON.stringify(data));
      res.send(JSON.stringify(data));
    })
    .catch(err => console.log("Error : " + err));
});

router.get("/get-special/:id", (req, res, next) => {
  console.log("Here is rest ");

  db.query('SELECT * FROM "tbl_user" WHERE "first_name"=:value', {
    replacements: { value: req.params.id },
    model: db.User,
    mapToModel: true
  })
    .then(data => {
      console.log("Success : " + data);
      res.send("OK : " + JSON.stringify(data[0], null, 2));
    })
    .catch(err => console.log("Error : " + err));
});

module.exports = router;

const mailSender = require("../utils/mailsender");

router.post("/login", async (req, res, next) => {
  console.log("Body : " + JSON.stringify(req.body));

  let encryptedPass;

  User.findAll({
    where: {
      username: req.body.username
    }
  })
    .then(response => {
      if (response == null || response == undefined || !response) {
        res.status(400).send("User Not Found !");
      }
      // console.log(res[0].dataValues);
      console.log("Response : " + JSON.stringify(response[0]));
      console.log("Response username : " + response[0].username);

      encryptedPass = response[0].password;
      console.log("Encrypted pass‌:" + encryptedPass);
      let options = {
        expiresIn: "1h"
      };

      
      bCrypt
        .compare(req.body.password, encryptedPass)
        .then(q => {
          if (q) {
            console.log("Password Okay !" + q);
            let token = jwt.sign({ data: response[0] }, SECRET_KEY, options);
            console.log("Token :" + token);
          
            se(message, (error, info) => {
              if (!error) {
                console.log("Mail Sent : " + JSON.stringify(info));
              } else {
                console.log("Mail does not send : " + error);
              }
            });
            res.send({ token: token, dateCreated: new Date().toString() });
          } else {
            res.send("Username Password mismatch ! ");
          }
        })
        .catch(err => {
          res.send("Error : " + err);
        });
    })
    .catch(err => {
      console.log("Error :" + err);
      res.send("Error :  " + err);
    });
});

router.post("/token-verify", (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    let token = req.headers.authorization;

    jwt.verify(token, SECRET_KEY, (e, data) => {
      if (e) {
        res.send("Error : " + e);
      } else {
        res.json({
          message: "Okay",
          status: 200,
          data: data
        });
      }
    });
  }
});
