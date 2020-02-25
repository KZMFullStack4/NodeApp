const express = require('express');
var bodyParser = require('body-parser')
const path= require('path');

const db = require('./config/database');
const app =express(); 


const userRoutes = require('./routes/users');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use('/user',userRoutes);

app.use('/sample',(re,res)=>{
    res.json({name:'Saeed',family:'Kazemi'})
})
//Database 

const sync=()=>{
    return db.sync();//{force:true}
}

sync().then(()=>{
    console.log('\nTables created ....');
    
})
.catch(err=>console.log('Error : ' +err))







db.authenticate()
.then(()=>{
    console.log('Database connected ...');
    
}).catch((err)=>{

    console.log('Eror : ' +err);
    
})





const  PORT=process.env.PORT || 3000;


app.listen(PORT,console.log(`Server started on port ${PORT}`));