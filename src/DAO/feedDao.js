class feedDAO {

    cosntructor(){}

    selectFeedList = async (conn, profileId) => {
        const selectFeedList = `
        SELECT Feeds.updatedAt, content, Feeds.ImgUrl
        FROM Feeds
        WHERE Feeds.ProfileId = ?
        `
        const [feedListRow] = await conn.query(selectFeedList, profileId);

        return feedListRow;
    }

}


module.exports = feedDAO;
