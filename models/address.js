
const sequelize =require('sequelize');
const db = require('../config/database')


let User = require('./user').User;

let Address = db.define('Address',{

    id:{
        type:sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    city:sequelize.STRING,
    alley:sequelize.STRING,
    block:sequelize.INTEGER

},{
    createdAt:false,
    updatedAt:false,
    // tableName:'tbl_address',
    freezeTableName:true
    
})



module.exports={
    address :Address
};

