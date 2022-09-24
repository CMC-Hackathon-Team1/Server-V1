class userDAO {

    cosntructor(){}

    retrieveUserProfiles = async (conn,userId) => {
        const retrieveUserProfilesQuery = `SELECT profileId,profileImgUrl,profileName FROM Profiles
        RIGHT JOIN Users U on Profiles.userId = U.userId
        WHERE U.userId=${userId};`;

        const [profileRow] = await conn.query(retrieveUserProfilesQuery);

        console.log(retrieveUserProfilesQuery);
        console.log(profileRow);

        return profileRow;
    }

}


module.exports = userDAO;
