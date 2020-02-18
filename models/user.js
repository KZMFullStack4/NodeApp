const Sequelize = require("sequelize");
const db = require("../config/database");
let Address = require('./address').address;
let Role = require('./role').role;

const User = db.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING,
      field: "first_name" // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    lastName: {
      type: Sequelize.STRING
    }
  },
  {
    createdAt: false,
    updatedAt: false,
    // tableName: "tbl_user",
    freezeTableName: true // Model tableName will be the same as the model name
  }
);



const UserRole = db.define('UserRole', {},{
  updatedAt: false,
  tableName: "tbl_user_role",
  freezeTableName: false 
});




User.belongsToMany(Role, { as: 'Role', through: 'tbl_user_role' });//Many to Many
Role.belongsToMany(User, { as: 'User', through:'tbl_user_role'});//Many to Many
Address.belongsTo(User,{ foreignKey: 'user_id'});//One toOne relationship



module.exports = {
  User: User
};

