const express  = require("express");
const router = express.Router();

const userRouter = require('./userRouter');
const noticeRouter = require('./noticeRouter');
const feedRouter = require("./feedRouter");
const fileRouter = require("../imageUploader/ImageUploader");

module.exports = () => {
    
    feedRouter(router);
    userRouter(router);
    noticeRouter(router);
    fileRouter(router);
    
    return router;
}
