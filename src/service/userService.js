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

    // 유저 페르소나 생성
    createUserPersona = async (userId, personaId, nickname, introduction, profileImgUrl) => {
        const connection = await pool.getConnection(async (connection) => connection);

        try {
            await connection.beginTransaction();

            // 사용자 ID를 통해 해당 사용자의 페르소나 추가
            const createPersona = await this.userDAO.createPersonaByUserId(connection, userId, personaId, nickname, introduction, profileImgUrl);

            await connection.commit();

            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }
}

module.exports = userService;