const express  = require("express");
const router = express.Router();

const adminRouter = require("./admin.router");
const feedRouter = require('./feedRouter');
const userRouter = require('./userRouter');
const noticeRouter = require('./noticeRouter');


module.exports = () => {
    
    feedRouter(router);
    userRouter(router);
    noticeRouter(router);
    adminRouter(router);
    
    return router;
}
