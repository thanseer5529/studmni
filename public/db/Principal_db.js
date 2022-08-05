const db = require("./db_connect");
module.exports = {
    get_Dept: (data) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async (con) => {
                    let collections = await con.db(data).listCollections().toArray();
                    resolve(collections);
                })
                .catch((err) => {
                    reject("db connection problem ( Principal_db:get_Dept)");
                });
        });
    },
    get_students: (plat, dept) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async (con) => {
                    let data = await con
                        .db(plat)
                        .collection(dept)
                        .find({}, { fields: { Students: 1, _id: 0 } })
                        .toArray();
                    let std = data[0].Students;
                    let content = [];
                    if (std.length > 0) {
                        content = std.filter((el) => {
                            if ((el.candidate === "student")) return el;
                        });
                    }

                    resolve(content);
                })
                .catch((err) => {
                    reject("db connection problem ( Principal_db:get_students)", err);
                });
        });
    },
    get_alumnis: (plat, dept) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async (con) => {
                    let data = await con
                        .db(plat)
                        .collection(dept)
                        .find({}, { fields: { Students: 1, _id: 0 } })
                        .toArray();
                    let std = data[0].Students;
                    let content = [];
                    if (std.length > 0) {
                        content = std.filter((el) => {
                            if ((el.candidate === "alumini")) return el;
                        });
                    }

                    console.log(data, "alm");
                    resolve(content);
                })
                .catch(() => {
                    reject("db connection problem ( Principal_db:get_alumnis)");
                });
        });
    },

    get_dash_msg: (plat) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then(async (con) => {
                    let new_data = await con
                        .db(plat)
                        .collection("details")
                        .find({}, { fields: { dash_smg: 1, _id: 0 } })
                        .toArray();
                    resolve(new_data);
                })
                .catch((err) => {
                    console.log(err, "yhyhy");
                    reject("db connection problem ( Principal_db:get_alumnis)", err);
                });
        });
    },
    make_dash_msg: (plat, content) => {
        console.log("lounched");
        return new Promise((resolve, reject) => {
            db.get_db().then((con) => {
                let who = content.who;
                delete content.who;
                console.log(plat, who, content);
                con.db(plat)
                    .collection(who)
                    .updateOne({ Dept_Name: who }, { $push: { from_principal: content } })
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject("could not upload message");
                    });
            });
        });
    },
    get_details: (plat) => {
        console.log("lounched");
        return new Promise((resolve, reject) => {
            db.get_db()
                .then(async (con) => {
                    let data = await con.db(plat).collection("details").find().toArray();
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                });
        });
    },
    edit_plat: (plat, content) => {
        return new Promise((resolve, reject) => {
            db.get_db().then((con) => {
                if (plat != content.Instit_Name) {
                    con.db()
                        .admin()
                        .listDatabases((err, data) => {
                            
                            check = false;
                            for (i of data.databases) {
                                if (i.name == plat) {
                                    check = true;
                                    break;
                                }
                            }
                            if (check) {
                                con.db(plat)
                                    .collection("details")
                                    .update({ Instit_Name: plat }, { $set: content })
                                    .then(() => {
                                        resolve()
                                    })
                                    .catch((err) => {
                                        console.log(err);

                                        reject("could not edit institution profile");
                                    });
                            } else {
                                reject("platform name alreay exist")
                            }
                        });
                } else {
                    con.db(plat)
                        .collection("details")
                        .update({ Instit_Name: plat }, { $set: content })
                        .then(() => {
                            resolve()

                        })
                        .catch((err) => {
                            reject("could not edit institution profile");
                        });
                }
            });
        });
    },
};
