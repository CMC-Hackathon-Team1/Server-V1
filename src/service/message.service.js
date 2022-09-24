const { pool } = require('../asset/db');
const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

const MessageRepository = require('../repository/message.repository');
const RoomRepository = require('../repository/room.repository');
class MessageService {
    MessageRepository;
    RoomRepository;

    constructor(){
        this.MessageRepository = new MessageRepository();
        this.RoomRepository = new RoomRepository();
    }

    postMessage = async (userIdx, partnerIdx, content) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();
    
            const userParams = [userIdx, partnerIdx];
            const userDoubleParams = [userIdx, partnerIdx, partnerIdx, userIdx];
            let selectedRoomInfoResult = await this.RoomRepository.selectRoom(connection, userDoubleParams);
    
            if (selectedRoomInfoResult[0] == null){
                await this.RoomRepository.startMessageRoom(connection, userParams);
    
                selectedRoomInfoResult = await this.RoomRepository.selectRoom(connection, userDoubleParams);
            }
            
            const roomIdx = selectedRoomInfoResult[0].roomIdx;
            const postMessageParams = [roomIdx, userIdx, content];
    
            await this.MessageRepository.insertMessage(connection, postMessageParams);
            
            await connection.commit();
    
            return response(baseResponse.SUCCESS);
        } catch (e){
            console.log(e);
            await connection.rollback();
    
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    getMessages = async (userIdx, partnerIdx) => {
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            
            const memberParams = [userIdx, partnerIdx, partnerIdx, userIdx];
            const getMessageResult = await this.MessageRepository.selectMessages(connection, memberParams);
            
            connection.release();
    
            return response(baseResponse.SUCCESS, getMessageResult);
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }
}

module.exports = MessageService;