
class RoomRepository {

    cosntructor(){}

    startMessageRoom = async (connection, userParmas) => {
        const insertRoomQuery = `
            INSERT INTO room(user_1, user_2)
            values(?,?)
        `;
    
        const [insertRoomResult] = await connection.query(insertRoomQuery, userParmas);
    
        return insertRoomResult;
    }
    
    selectRoom = async (connection, userParmas) => {
        const selectRoomQuery = `
            SELECT roomIdx
            FROM room
            WHERE (user_1 = ? and user_2 = ?) or (user_2 = ? and user_1 = ?) 
        `;
        
        const [selectRoomResult] = await connection.query(selectRoomQuery, userParmas);
    
        return selectRoomResult;
    }

}

module.exports = RoomRepository;