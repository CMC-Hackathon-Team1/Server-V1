const express  = require("express");
const router = express.Router();

const adminRouter = require("./admin.router");
const userRouter = require('./userRouter');
const noticeRouter = require('./noticeRouter');
const feedRouter = require("./feedRouter");

module.exports = () => {
    
    feedRouter(router);
    userRouter(router);
    noticeRouter(router);
    adminRouter(router);
    
    return router;
}
