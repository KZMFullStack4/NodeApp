const sequileze = require("sequelize");

const db = require("../config/database");

const User = require('./user').User;
let Role = db.define(
  "Role",
  {
    id: {
      type: sequileze.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleTitle: sequileze.STRING
  },
  {
    createdAt: false,
    updatedAt: false,
    // tableName: "tbl_role",
    freezeTableName: true
  }
);




module.exports = {
  role: Role
 
};
