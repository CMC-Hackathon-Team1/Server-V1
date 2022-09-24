class noticeDAO {

    cosntructor(){}

    selectNoticeList = async (conn, pagingQuery) => {
        const selectQuery = `
            SELECT *
            FROM Notice
        `;
        const orderByQurey = ` ORDER BY noticeId DESC`;
        const [selectResult] = await conn.query(selectQuery+orderByQurey+pagingQuery);

        console.log(selectResult);
        return selectResult;
    }
}


module.exports = noticeDAO;
