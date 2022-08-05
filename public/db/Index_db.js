const db = require("./db_connect");
// const test = require("./test");
// console.log("name is ",test.name);
// test.change_name("thanu")
// console.log("name is ",test.name);

module.exports = {
    suggestiion: async (content) => {
        return new Promise(async (resolve, reject) => {
            await db.get_db().then((con) => {
                con.db("studmni")
                    .collection("suggestions")
                    .insertOne(content)
                    .then((data) => {
                        resolve(data.ops[0]._id);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        });
    },
    create_plat: async (content) => {
        return new Promise(async (resolve, reject) => {
            await db.get_db().then((con) => {
                var dbnm = content.Instit_Name;

                con.db()
                    .admin()
                    .listDatabases((err, data) => {
                        console.log(data.databases);
                        check = true;
                        for (i of data.databases) {
                            if (i.name == dbnm) {
                                check = false;
                                break;
                            }
                        }
                        if (check) {
                            content.dash_smg = [];
                            con.db(dbnm)
                                .collection("details")
                                .insertOne(content)
                                .then(async (data) => {
                                    keys = Object.keys(content);
                                    arr = keys.filter((ele) => {
                                        return (
                                            ele.startsWith("Dept_Username") ||
                                            ele.startsWith("Dept_Name") ||
                                            ele.startsWith("Dept_password")
                                        );
                                    });
                                    for (let i = 0; i < arr.length / 3; i++) {
                                        item = arr.filter((ele) => {
                                            return ele.endsWith(i);
                                        });
                                        await db.get_db().then((con) => {
                                            console.log(content);
                                            con.db(dbnm)
                                                .collection(content[item[0]])
                                                .insertOne({
                                                    Dept_Name: content[item[0]],
                                                    Dept_Username: content[item[1]],
                                                    Dept_password: content[item[2]],
                                                    to_candidates: [],
                                                    from_principal: [],
                                                    Students: [],
                                                })
                                                .then((data) => {
                                                    con.db(dbnm)
                                                        .collection(content[item[0]])
                                                        .createIndex({ "Students.reg_no": 1 }, { unique: true })
                                                        .then(() => {
                                                            resolve({ who: "principal", data: content, status: "unique" });
                                                        })
                                                        .catch(async (err) => {
                                                            await con.db(dbnm).dropDatabase();
                                                            reject(err);
                                                        });
                                                })
                                                .catch(async (err) => {
                                                    await con.db(dbnm).dropDatabase();
                                                    reject(err);
                                                });
                                        });
                                    }
                                })
                                .catch(async (err) => {
                                    await con.db(dbnm).dropDatabase();
                                    reject(err);
                                });
                        } else {
                            resolve({ status: "already" });
                        }
                    });
            });
        });
    },
    login_plat: (content) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get_db()
                .then((con) => {
                    dbnm = content.Insti;
                    con.db()
                        .admin()
                        .listDatabases(async (err, data) => {
                            // console.log(data.databases);
                            check = false;
                            for (i of data.databases) {
                                if (i.name == dbnm) {
                                    check = true;
                                    break;
                                }
                            }
                            console.log(dbnm, check);
                            if (check) {
                                if (content.Identity == "Principal") {
                                    let usr = await con
                                        .db(dbnm)
                                        .collection("details")
                                        .findOne({ Username: content.UserName, password2: content.Password });
                                    console.log(usr);
                                    if (usr) {
                                        console.log(usr);
                                        // console.log("login");

                                        let collections = await con.db(dbnm).listCollections().toArray();

                                        resolve({ who: "principal", data: usr });
                                    } else {
                                        // console.log("no user");
                                        reject("password or username is incorrect");
                                    }
                                } else if (content.Identity == "Hod") {
                                    console.log("hod");
                                    let collections = await con.db(dbnm).listCollections().toArray();
                                    coll_check = false;
                                    console.log(collections);
                                    for (let i = 0; i < collections.length; i++) {
                                        if (collections[i].name == content.Dept) {
                                            coll_check = true;
                                            break;
                                        }
                                    }
                                    if (coll_check) {
                                        // console.log("yes department is here");
                                        let usr = await con.db(dbnm).collection(content.Dept).findOne({
                                            Dept_Name: content.Dept,
                                            Dept_Username: content.UserName,
                                            Dept_password: content.Password,
                                        });

                                        if (usr) {
                                            console.log(usr);
                                            usr.Instit_Name = dbnm;
                                            resolve({ who: "Hod", data: usr });
                                        } else {
                                            reject("username or password is incorrect");
                                        }
                                    } else {
                                        // console.log("not found");
                                        reject("there is no Department like you entered");
                                    }
                                } else if (content.Identity == "User") {
                                    let collections = await con.db(dbnm).listCollections().toArray();
                                    coll_check = false;
                                    console.log(collections);
                                    for (let i = 0; i < collections.length; i++) {
                                        if (collections[i].name == content.Dept) {
                                            coll_check = true;
                                            break;
                                        }
                                    }
                                    if (coll_check) {
                                        console.log(content);
                                        let usr = await con
                                            .db(dbnm)
                                            .collection(content.Dept)
                                            .find(
                                                { Dept_Name: content.Dept },
                                                {
                                                    fields: {
                                                        Students: {
                                                            $elemMatch: {
                                                                reg_no: content.UserName,
                                                                password: content.Password,
                                                            },
                                                        },
                                                        _id: 0,
                                                    },
                                                }
                                            )
                                            .toArray();

                                        //     if (usr) {
                                        //         console.log(usr);
                                        //         usr.Instit_Name = dbnm;
                                        //         resolve({ who: "Hod", data: usr });
                                        //     } else {
                                        //         reject("username or password is incorrect");
                                        //     }
                                        console.log(usr, ",,user");
                                        if (Object.keys(usr[0]).length == 1) {
                                            console.log("user ", usr[0].Students);
                                            resolve({ who: "User", data: usr[0].Students });
                                        } else {
                                            reject("there is no user like you entered");
                                        }
                                    } else {
                                        reject("there is no Department like you entered");
                                    }
                                }
                            } else {
                                reject("there is no institution like you entered");
                            }
                        });
                })
                .catch(() => {
                    reject("db connection problem ( index_db:login_plat)");
                });
        });
    },
};
