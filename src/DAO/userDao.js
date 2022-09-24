class userDAO {

    cosntructor(){}

    createPersonaByUserId = async (conn, userId, personaId, nickname, introduction, profileImgUrl) => {
        const createPersonaQuery = `
            INSERT INTO Profiles (userId, personaId, profileImgUrl, statusMessage, profileName)
            VALUE (?, ?, ?, ?, ?)
        `;

        const createPersonaParams = [userId, personaId, profileImgUrl, introduction, nickname];

        const [creationResult] = await conn.query(createPersonaQuery, createPersonaParams);

        return;
    }

    checkPersona = async (conn, userId) => {
        const checkPersonaQuery = `
            SELECT COUNT(*) as count
            FROM Profiles
            WHERE userId= ?
        `;

        const [checkPersonaResult] = await conn.query(checkPersonaQuery, userId);

        return checkPersonaResult;
    }
}


module.exports = userDAO;
