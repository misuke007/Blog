const path = require('path')

exports.moveFile = (file , name) => {

    file.photo.mv(`public/user_profil/${name}` , (error) => {

        if(error) return error 
    })

    return true
}