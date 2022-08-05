const express = require("express");
const router = express.Router();
const db = require("../public/db/Hod_db");
let Chat_connection = require("../public/db/chat/Chat_connection");



function islogin(req, res, next) {
    console.log(req.session[req.params.who + "_Hod_" + req.params.dept]);
    if (req.session[req.params.who + "_Hod_" + req.params.dept]) next();
    else res.redirect("/");
}

router.get("/:who/:dept", islogin, function (req, res, next) {
    db.get_students(req.params.who, req.params.dept)
        .then((data) => {
            console.log(data[0], "dasa from db");
            console.log(req.session[req.params.who + "_Hod_" + req.params.dept]);
            req.session[req.params.who + "_Hod_" + req.params.dept].data.Students = data[0].Students;
            console.log(req.session[req.params.who + "_Hod_" + req.params.dept].data.Students, "after db");

            res.render("Hod/Home-screen", {
                data: req.session[req.params.who + "_Hod_" + req.params.dept],
                header: { who: "hod", data: req.session[req.params.who + "_Hod_" + req.params.dept] },
            });
        })
        .catch(() => {
            res.send("error while fetching student list from database");
        });
});

router.post("/add_candidates/:who/:dept", islogin, function (req, res, next) {
    if (req.session[req.params.who + "_Hod_" + req.params.dept]) {
        db.add_candidates(req.params.who, req.params.dept, req.body.cnd_data)
            .then((data) => {
                req.session[req.params.who + "_Hod_" + req.params.dept].data.Students = req.session[
                    req.params.who + "_Hod_" + req.params.dept
                ].data.Students.concat(req.body.cnd_data);
                console.log(req.session[req.params.who + "_Hod_" + req.params.dept].data.Students, "stdssss");
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.json({ message: "failed to add candidates" });
            });
    } else {
        res.json({ err: true });
    }
});

router.post("/change_pass/:who/:dept", islogin, function (req, res, next) {
    // console.log(req.session[req.params.who + "_Hod_" + req.params.dept]);
    if (req.session[req.params.who + "_Hod_" + req.params.dept]) {
        db.change_password(req.params.who, req.params.dept, req.body.pass)
            .then(() => {
                req.session[req.params.who + "_Hod_" + req.params.dept].data.Dept_password = req.body.pass;
                console.log("yhyhyh");
                res.json("");
            })
            .catch((err) => {
                console.log(err);
                res.json({ message: "password not updated" });
            });
    } else {
        res.json({ err: true });
    }
});

router.get("/chat/:who/:dept", islogin, function (req, res, next) {
    // let content=req.session[req.params.who + "_Hod_" + req.params.dept]
    // io.on("connection", (socket) => {
    //     console.log("socket had been connected");
    //     socket.on("disconnect", () => {
    //         console.log("socket had been disconnected");
    //     });
    //     let plat = req.params.who;
    //     let dept = req.params.dept;
    //     socket.on(plat + "_hod_" + dept, (msg) => {
    //         io.emit(plat + "_user_" + dept, msg);
    //     });
    // });

    // Chat_connection.build_chat.call_fn({ plat: req.params.who, dept: [req.params.dept] })
    let content = req.session[req.params.who + "_Hod_" + req.params.dept];

    res.render("Hod/chat_screen", {
        header: { who: "hod", data: req.session[req.params.who + "_Hod_" + req.params.dept] },
        data: {
            dept: content.data.Dept_Name,
            dash_smg: content.data.from_principal,
            plat: req.session[req.params.who + "_Hod_" + req.params.dept].data.Instit_Name,
        },
    });
});

router.get("/Dashboard/:who/:dept", islogin, function (req, res, next) {
    db.get_dash_msg(req.params.who, req.params.dept)
        .then((data) => {
            req.session[req.params.who + "_Hod_" + req.params.dept].data.from_principal = data[0].from_principal;
            console.log(req.session[req.params.who + "_Hod_" + req.params.dept], "session");
            let content = req.session[req.params.who + "_Hod_" + req.params.dept];
            res.render("Hod/dashboard", {
                header: { who: "hod", data: req.session[req.params.who + "_Hod_" + req.params.dept] },
                data: {
                    dept: content.data.Dept_Name,
                    dash_smg: content.data.from_principal,
                    plat: req.session[req.params.who + "_Hod_" + req.params.dept].data.Instit_Name,
                },
            });
        })
        .catch((err) => {
            res.send("err while fetching  dash message of principal");
        });
});

router.post("/Dashboard/:who/:dept", islogin, function (req, res, next) {
    console.log(req.body);
    console.log(req.files, "imagesssss");

    // let content = req.session[req.params.who + "_Hod_" + req.params.dept];
    // res.render("Hod/dashboard", {
    //     header: { who: "hod", data: req.session[req.params.who + "_Hod_" + req.params.dept] },
    //     data: { dept: content.data.Dept_Name },
    // });

    if (req.files)
        req.body.image_name = req.params.who + "_" + req.params.dept + "_" + req.files.dash_msg_file.name;
    console.log(req.body);
    let who = req.body.who;
    db.make_dashboard(req.params.who, req.params.dept, req.body)
        .then(() => {
            if (req.files) {


                if (who == "candidate") {
                    req.files.dash_msg_file
                        .mv("./public/dash_file/candidate/" + req.body.image_name)
                        .then(() => {
                            console.log("dashboard image is uploaded");
                            res.json((err = false));

                        })
                        .catch((err) => {
                            console.log("failed to upload image", err);
                            res.json((err = true));

                        });
                } else {
                    req.files.dash_msg_file
                        .mv("./public/dash_file/principal/" + req.body.image_name)
                        .then(() => {
                            console.log("dashboard image is uploaded");
                            res.json((err = false));

                        })
                        .catch((err) => {
                            console.log("failed to upload image");
                            res.json((err = true));

                        });
                }
            }
            else {
                res.json((err = false))
            }
        })
        .catch((err) => {
            res.json((err = true));
        });
});
module.exports = router;
