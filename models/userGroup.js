const db = require('../config/database');

const groupKind = require('../utils/GroupKind');
const sequlieze = require('sequelize');

let UserGroup = db.define("UserGroup",{
    id:{
        type:sequlieze.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    groupName:sequlieze.STRING,
    createdDate:sequlieze.DATE,
    groupKind:groupKind.KIND2
},{
    createdAt:false,
    updatedAt:false,
    freezeTableName:true

});

let User = require('../models/user').User;
UserGroup.hasMany(User)


module.exports=UserGroup;