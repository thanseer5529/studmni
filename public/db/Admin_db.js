const db = require("./db_connect");
module.exports = {
    get_suggestiion: async () => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async(con) => {
                    content = await con.db("studmni").collection("suggestions").find().toArray();
                    resolve(content);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};
