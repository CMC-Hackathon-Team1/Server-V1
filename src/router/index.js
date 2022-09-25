const express  = require("express");
const router = express.Router();

const userRouter = require('./userRouter');
const noticeRouter = require('./noticeRouter');
const feedRouter = require("./feedRouter");
const imageRouter = require("./imageRouter");


module.exports = () => {
    
    feedRouter(router);
    userRouter(router);
    noticeRouter(router);
    imageRouter(router);

    return router;
}
