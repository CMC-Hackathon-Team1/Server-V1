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
}


module.exports = userDAO;
