const noticeDAO = require('../DAO/noticeDAO');

const { pool } = require('../config/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class noticeService {
    noticeDAO;

    constructor() {
        this.noticeDAO = new noticeDAO();
    }

    retrieveNoticeList = async (page) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            let offset;
            let pagingQuery=``;
            if (page !== undefined) {
                offset = (page-1)*10;
                pagingQuery += ` limit 10 offset ${offset}`;
            }

            const noticeResult = await this.noticeDAO.selectNoticeList(connection, pagingQuery);

            await connection.commit();

            return response(baseResponse.SUCCESS, noticeResult);
        } catch (e) {
            console.log(e);

            await connection.rollback();
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        } 
    }
}

module.exports = noticeService;