
const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
module.exports= new Sequelize('postgres', 'postgres', '120412', {
  host: 'localhost',
  dialect: 'postgres',
  pool:{
      max:5,
      min:0,
      idle:10000
  }
});
