const feedDAO = require('../DAO/feedDAO');

const { pool } = require('../config/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class feedService {

    feedDAO;
    // CommentRepository;
    // PostRepository;
    // UserRepository;

    constructor() {
        this.feedDAO = new feedDAO();
        // this.CommentRepository = new CommentRepository();
        // this.PostRepository = new PostRepository();
        // this.UserRepository = new UserRepository();
    }


}

module.exports = feedService;