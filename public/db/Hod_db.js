const db = require("./db_connect");
module.exports = {
    add_candidates: (plat, dept, content) => {
        return new Promise(async (resolve, rejcet) => {
            await db
                .get_db()
                .then((con) => {
                    // console.log(content);
                    // db_data = content.pop();
                    // dbnm = db_data.insti;
                    // dept = db_data.dept;

                    con.db(plat)
                        .collection(dept)
                        .updateOne({ Dept_Name: dept }, { $push: { Students: { $each: content } } })
                        .then((data) => {
                            console.log(data.result.n, "rtr");
                            if (data.result.n > 0) resolve("candidates are uploaded");
                            else rejcet("candidate are not uploaded");
                        })
                        .catch((err) => {
                            rejcet("adding candidates is failed");
                        });
                })
                .catch((err) => {
                    rejcet();
                    console.log("db connection problem (add_candidates)");
                });
        });
    },
    change_password: (plat, dept, pass) => {
        return new Promise(async (resolve, rejcet) => {
            await db
                .get_db()
                .then((con) => {
                    con.db(plat)
                        .collection(dept)
                        .updateOne({ Dept_Name: dept }, { $set: { Dept_password: pass } })
                        .then((data) => {
                            resolve();
                        })
                        .catch((err) => {
                            rejcet("changing password is failed", err);
                        });
                })
                .catch((err) => {
                    rejcet();
                    console.log("db connection problem (change_password)", err);
                });
        });
    },
    make_dashboard: (plat, dept, content) => {
        return new Promise(async (resolve, rejcet) => {
            await db
                .get_db()
                .then((con) => {
                    if (content.who == "candidate") {
                        delete content.who;
                        con.db(plat)
                            .collection(dept)
                            .updateOne({ Dept_Name: dept }, { $push: { to_candidates: content } })
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                rejcet("uploading dashboard is failed", err);
                            });
                    } else {
                        delete content.who;
                        content.author = dept;
                        con.db(plat)
                            .collection("details")
                            .updateOne({ Instit_Name: plat }, { $push: { dash_smg: content } })
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                rejcet("uploading dashboard is failed", err);
                            });
                    }
                })
                .catch((err) => {
                    rejcet();
                    console.log("db connection problem (change_password)", err);
                });
        });
    },
    get_dash_msg: (plat, dept) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async (con) => {
                    let new_data = await con
                        .db(plat)
                        .collection(dept)
                        .find({}, { fields: { from_principal: 1, _id: 0 } })
                        .toArray();
                    resolve(new_data);
                })
                .catch((err) => {
                    console.log(err);
                    reject("db connection problem ( Hod_db:get_dash_msg)", err);
                });
        });
    },
    get_students: (plat, dept) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async (con) => {
                    let student = await con
                        .db(plat)
                        .collection(dept)
                        .find({}, { fields: { Students: 1, _id: 0 } })
                        .toArray();
                    resolve(student);
                })
                .catch((err) => {
                    console.log(err);
                    reject("db connection problem ( Hod_db:get_students)");
                });
        });
    },
};