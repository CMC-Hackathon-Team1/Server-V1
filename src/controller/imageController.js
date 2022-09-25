const dotenv = require('dotenv');
dotenv.config();
const AWS = require('aws-sdk')
const multer = require('multer')
const multers3 = require('multer-s3')
const path = require('path')
const baseResponse = require("../utility/baseResponseStatus");
const {response, errResponse} = require("../utility/response");
const imageService = require("../service/imageService");

const s3 = new AWS.S3();

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: "AKIASCGJMRMBFIQKB4KR",
    secretAccessKey: "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",
});

allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp']


const imageUploader = multer({
    storage: multers3({
        s3 : s3,
        bucket: 'hackathon-node',
        key : (req,file,callback) => {
            const uploadDirectory = req.query.directory = undefined?  '': req.query.directory
            const extension = path.extname(file.originalname)
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error('wrong extension'))
            }
            callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`)
        },
        acl:'public-read-write'
    })
}).single('image'), (req, res) => {
    
    
    const confirmationId =req.body.confirmationId;

    const fileLocation = req.file.location;

    if (!confirmationId) {
        return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    }

    if (!fileLocation) {
        return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    }

    const postImagesResponse = await imageService.postImagesInConfirmation(confirmationId,fileLocation);

    console.log( postImagesResponse);

    return res.send(response(postImagesResponse));
}

module.exports = {
    imageUploader
};
