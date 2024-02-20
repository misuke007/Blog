const {extract} = require('../librairies/extractFormat')
const {fileName} = require('../librairies/fileName')
const path = require('path')
const sharp = require('sharp')

exports.moveFile =  (photo , fileName) => {


    let imagePath = path.join(__dirname , `../public/photo/${fileName}`)
    let format = extract(photo)

     sharp(photo.photo.data)

    .toFormat(format, { quality: 60 })
    .toFile(imagePath , (error) => {

         if(error){

             console.log(error)
         }
    })

}