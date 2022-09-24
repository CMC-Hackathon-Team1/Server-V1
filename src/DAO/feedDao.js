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
