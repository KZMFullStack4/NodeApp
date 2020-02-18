const express = require("express");

const router = express.Router();

const db = require("../config/database");

const User = require("../models/user").User;

const createUser = require("../models/user");
const bCrypt = require('bcrypt');

let result = createUser.createUser;

console.log("Result of creation" + result);

router.post("/add",async (req, res, next) => {
  console.log("Here is Router ");

  console.log(JSON.stringify(req.body.firstname));

  const hashedPassword=await bCrypt.hash(req.body.lastname,10)
  console.log("Hashed  pass : " +hashedPassword);
  
  User.create({
    firstName: req.body.firstname,
    lastName: hashedPassword
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
        // criteria
    }
  })
  .then(function() {
    console.log("Deleted"); // { '0': 0 } - why not same as in bulkUpdate?
  })
  .cath(err => {
    console.log("err");
  });

  // User.destroy({ where: { id: req.params.id } })
  //   .then(function() {
  //     console.log("Deleted"); // { '0': 0 } - why not same as in bulkUpdate?
  //   })
  //   .cath(err => {
  //     console.log("err");
  //   });
});




// let arrowFun = (a,b)=>{

//   return a+b;
// }

// let finalR =arrowFun(1,1);

let myUser=[];
router.get("/get-all", async (req, res, next) => {
  let users = await User.findAll()
    .then(data => {
      console.log("Get ALl successfull : " + JSON.stringify(data));
      res.send('Success' + JSON.stringify(data))

      this.myUser=data;
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
        res.send('OK : ' +JSON.stringify(data[0], null, 2))
      })
      .catch(err => console.log("Error : " + err));

});

module.exports = router;

router.post('/login', async (req,res,next)=>{

  console.log("Here is User Array : " +this.myUser);
  
  const user =this.myUser.find(find=>find.firstName==req.body.firstname);
  console.log("\nFound : " +JSON.stringify(user));
  if(user==null){
    return res.status(400).send("User Not Found !");
  }
      try{

        if(await bCrypt.compare(req.body.lastname,user.lastName)){
          res.send("Success login ")
        }else{
          res.send("Not Allowed ")
        }
      }catch{
        
        res.status(500).send();
      }
  
})
