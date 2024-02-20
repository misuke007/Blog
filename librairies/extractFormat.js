const path = require('path')

exports.extract = (file) => {

    const format = path.extname(file.photo.name).substring(1)
    return format
}