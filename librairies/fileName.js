const path = require('path')

exports.fileName = (file) => {

    let ext = path.extname(file.photo.name)
    let newFileName = `FILE-${Date.now()}${ext}`
    
    return newFileName
}