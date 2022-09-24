class feedDAO {

    cosntructor(){}
    
    retrieveMyFeedDate = async (conn,  year,month) => {
        const retrieveMyFeedDateQuery = `SELECT date_format(createdAt,"%Y-%m-%d") as date FROM Feeds
        WHERE date_format(createdAt,"%Y-%m")="${year}-${month}";`;
        
        const [myFeedDateInfo] = await conn.query(retrieveMyFeedDateQuery);
    

        const myFeedDate=new Set();
        for(let i=0; i<myFeedDateInfo.length;i++){
            myFeedDate.add(myFeedDateInfo[i].date);
        }

        console.log(myFeedDate);

        return myFeedDate;
    }
    

    selectFeedList = async (conn, feedListQuery) => {
        const selectFeedList = `
        SELECT Feeds.updatedAt, content, Feeds.ImgUrl
        FROM Feeds
        WHERE Feeds.ProfileId = ?
        LIMIT ?, ?;
        `
        const [feedListRow] = await conn.query(selectFeedList, feedListQuery);

        return feedListRow;
    }
    
    // with Paging
    retrieveTotalDataCount = async (conn, profileId) => {
        const selectFeedList = `
        SELECT COUNT(profileId) as totalDataCount
        FROM Feeds
        WHERE profileId = ?;
        `
        const [totalDataCountRow] = await conn.query(selectFeedList, profileId);

        return totalDataCountRow;
    }

    selectFeedInfo = async (conn, feedInfoQuery) => {
        const selectFeedList = `
        SELECT personaName, profileName, updatedAt, content
        FROM Feeds
        JOIN Profiles on Profiles.profileId = Feeds.profileId
        JOIN Persona P on Profiles.personaId = P.personaId
        WHERE Profiles.profileId = ? and Feeds.feedId = ?
        `

        const [feedInfoRow] = await conn.query(selectFeedList, feedInfoQuery);

        return feedInfoRow;
    }

}


module.exports = feedDAO;
