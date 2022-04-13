const { User } = require('../models/User.model')
const fs = require('fs')

// Delete Un Used Images
function deleteIMG (){
numOfImages = 1;
let deletedImages = 0
// read images file
const filesName = fs.readdirSync('./images/')
filesName.forEach((file)=>{
    if(file != 'default.jpg'){
                numOfImages ++
// get images which used from database
        User.findOne({image: file})
            .then((user)=>{
                if(user){
//if image is in DB do no thing          
                }else{
                    numOfImages --
//else delete it from the file
                    fs.unlink(`./images//${file}` ,(err)=>{
                    if(err) return console.log(err);
                }) 
                }
            })
    
}})

// Print number of deleted images
console.log(`numOfImages : ${numOfImages}`);
}
module.exports = deleteIMG