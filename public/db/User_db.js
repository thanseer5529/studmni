const db = require("./db_connect");
module.exports = {
    update_user: (content, insti, dept, user) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then((con) => {
                    con.db(insti)
                        .collection(dept)
                        .updateOne(
                            {
                                "Students.reg_no": user,
                            },
                            {
                                $set: {
                                    "Students.$.name": content.name,
                                    "Students.$.status": content.status,
                                    "Students.$.mobile": content.mobile,
                                    "Students.$.password": content.password,
                                    "Students.$.verified": "true",
                                },
                            }
                        )
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            reject({ err: "candidate could not updated" });
                        });
                })
                .catch((err) => {
                    console.log("db connection problem in user_dbs at update_user", err);
                });
        });
    },
    get_dash_smg: (plat, dept) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async(con) => {
                   let data =await con.db(plat).collection(dept).find({}, { fields: { to_candidates:1, _id: 0 } }).
                       toArray()
                    resolve(data)
                })
                .catch((err) => {
                    console.log("db connection problem in user_dbs at update_user", err);
                    reject()
                });
        });
    },
};