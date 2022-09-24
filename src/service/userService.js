const userDAO = require('../DAO/userDAO');

const { pool } = require('../config/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class userService {

    userDAO;
    // CommentRepository;
    // PostRepository;
    // UserRepository;

    constructor() {
        this.userDAO = new userDAO();
        // this.CommentRepository = new CommentRepository();
        // this.PostRepository = new PostRepository();
        // this.UserRepository = new UserRepository();
    }


}

module.exports = userService;