class MessageRepository {

    cosntructor(){}
    
    insertMessage = async (connection, insertMessageParams) => {
        const insetMessageQuery = `
            INSERT INTO message(roomIdx, senderIdx, content)
            values(?,?,?)
        `;
        const [messageRow] = await connection.query(insetMessageQuery, insertMessageParams);
    
        return messageRow;
    }
    
    selectMessages = async (connection, userParams) => {
        const selectMessagesQuery = `
            SELECT user.id, message.content, message.createdAt
            FROM user
                INNER JOIN message ON message.senderIdx = user.userIdx
            WHERE (userIdx, content) IN (
                    SELECT senderIdx, content
                    FROM room
                        INNER JOIN user as u1 ON room.user_1 = u1.userIdx
                        INNER JOIN user as u2 ON room.user_2 = u2.userIdx
                        INNER JOIN message ON message.roomIdx = room.roomIdx
                        WHERE (u1.userIdx = ? AND u2.userIdx = ?) or (u2.userIdx = ? AND u1.userIdx = ?)
                    )
            ORDER BY message.createdAt ASC;
        `;
        const [messageRow] = await connection.query(selectMessagesQuery, userParams);
    
        return messageRow;
    }
}

module.exports = MessageRepository;