const fs = require("fs")
const Jimp = require('jimp')

// Make Slug
const Slug = (data) => {
    let name = data.toLowerCase()
    name = name.replace(/ /g, "-")
    name = name + '-' + Date.now()
    return name
}

// Get Host URL
const Host = (req) => {
    return req.protocol + '://' + req.get('host') + '/'
    // return 'https://' + req.get('host') + '/'
}

// Single file upload
const FileUpload = async (data, path) => {
    try {
        const image = data
        const extension = image.name.split('.')[1]

        const newName = Date.now() + '.' + extension
        uploadPath = path + newName
        const moveFile = image.mv(uploadPath)

        if (moveFile) return newName
    } catch (error) {
        if (error) return error
    }
}

// Resize to 200x200 & upload
const SmFileUpload = async (file, uploadpath) => {
    try {
        // Recived file data
        let image = await Jimp.read(file.data)
        await image.resize(200, 200)
        await image.quality(50)
        const newFile = 'product-' + Date.now() + '.png'
        await image.write(uploadpath + '/' + newFile)
        return newFile
    } catch (error) {
        if (error) return error
    }
}

// Resize to 800x800 & upload
const LgFileUpload = async (file, uploadpath) => {
    try {
        // Recived file data
        let image = await Jimp.read(file.data)
        await image.resize(800, 800)
        await image.quality(50)
        const newFile = 'product-' + Date.now() + '.png'
        await image.write(uploadpath + '/' + newFile)
        return newFile
    } catch (error) {
        if (error) return error
    }
}

// Delete file from directory
const DeleteFile = (destination, file) => {
    fs.unlink(destination + file, function (error) {
        if (error) {
            return error
        }
        return
    });
}


module.exports = {
    Slug,
    Host,
    FileUpload,
    SmFileUpload,
    LgFileUpload,
    DeleteFile
}