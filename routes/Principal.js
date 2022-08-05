const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const db = require("../public/db/Principal_db");
function islogin(req, res, next) {
    console.log(req.params.who, "who");
    console.log(req.session[req.params.who + "_principal"], "session");
    if (req.session[req.params.who + "_principal"]) next();
    else res.redirect("/");
}
router.get("/:who", islogin, function (req, res, next) {
    console.log(req.session[req.params.who + "_principal"], "session");
    res.render("Principal/home-screen", {
        data: req.session[req.params.who + "_principal"],
        header: { who: "principal", data: req.session[req.params.who + "_principal"].data.Instit_Name },
    });
});

router.get("/students/:dept/:who", islogin, function (req, res, next) {
    if (req.session[req.params.who + "_principal"]) {
        db.get_students(req.params.who, req.params.dept)
            .then((data) => {
                console.log(data, "ssss");
                res.render("Principal/Student_list", {
                    data,
                    header: { who: "principal", data: req.session[req.params.who + "_principal"].data.Instit_Name },
                });
            })
            .catch((err) => {
                console.log(err);
                res.send("faild to load student list");
            });
    } else {
        res.redirect("/");
    }
});

router.get("/alumnis/:dept/:who", islogin, function (req, res, next) {
    if (req.session[req.params.who + "_principal"]) {
        db.get_alumnis(req.params.who, req.params.dept)
            .then((data) => {
                console.log(data, "aaaaa");
                res.render("Principal/Student_list", {
                    data,
                    header: { who: "principal", data: req.session[req.params.who + "_principal"].data.Instit_Name },
                });
            })
            .catch((err) => {
                console.log(err);
                res.send("faild to load alumni list");
            });
    } else {
        res.redirect("/");
    }
});
router.get("/dept/:who", islogin, function (req, res, next) {
    let name = req.session[req.params.who + "_principal"].data.Instit_Name;
    db.get_Dept(name)
        .then((data) => {
            for (i in data) {
                if (data[i].name === "details") {

                    data.splice(i, 1)
                    break;
                }
            }
            console.log(data, "data");
            res.render("Principal/Dept.ejs", {
                data,
                name,
                header: { who: "principal", data: req.session[req.params.who + "_principal"].data.Instit_Name },
            });
        })
        .catch((err) => {
            console.log(err);
        });
});
router.get("/profile/:who", islogin, function (req, res, next) {
    db.get_details(req.params.who)
        .then((data) => {
            let obj = data[0];
            let dept = []
            for (j in obj) {
                if (j.startsWith("Dept_"))
                    dept.push(j)
            }
            console.log("details", dept, "details");
            res.render("Principal/profile", {
                header: { who: "principal", data: req.session[req.params.who + "_principal"].data.Instit_Name },
                data: data, dept: dept
            });
        })
        .catch((err) => {
            res.send("could not fetching principal details to edit");
        });
});
router.get("/dashboard/:who", islogin, function (req, res, next) {
    dept = [];
    arr = Object.keys(req.session[req.params.who + "_principal"].data);
    arr.map((ele) => {
        if (ele.startsWith("Dept_Name")) dept.push(req.session[req.params.who + "_principal"].data[ele]);
    });
    data = {
        name: req.session[req.params.who + "_principal"].data.Instit_Name,
        dept: dept,
    };

    db.get_dash_msg(req.params.who)
        .then((new_data) => {
            (req.session[req.params.who + "_principal"].data.dash_smg = new_data[0].dash_smg),
                console.log(req.session[req.params.who + "_principal"].data.dash_smg, "new session");
            console.log(data, "plat_info");
            res.render("Principal/dashboard", {
                header: { who: "principal", data: req.session[req.params.who + "_principal"].data.Instit_Name },
                data,
                dash_smg: req.session[req.params.who + "_principal"].data.dash_smg,
            });
        })
        .catch((err) => {
            console.log(err);
            res.send("error in fetching dashboard message");
        });
});

router.post("/dashboard/:who", islogin, function (req, res, next) {
    console.log(req.body, "body");
    if (req.files) {
        req.body.image_name = req.params.who + "_" + req.body.who + "_" + req.files.dash_msg_file.name;
    }
    db.make_dash_msg(req.params.who, req.body)
        .then(() => {
            if (req.files) {
                req.files.dash_msg_file
                    .mv("./public/dash_file/hod/" + req.body.image_name)
                    .then(() => {
                        console.log("dashboard image is uploaded");
                        res.json((err = false));

                    })
                    .catch((err) => {
                        console.log("failed to upload image", err);
                        res.json((err = true));

                    });
                console.log("sucess");
            }
            else {
                res.json((err = false));
                
            }
        })
        .catch(() => {
            console.log("could not upload dashboard principal");
            res.json((err = true));
        });
});
router.post("/edit_plat/:who", islogin, function (req, res, next) {
    console.log(req.body);
    addr = "./public/images/platform/" + req.params.who + ".jpg";
    fs.access(addr, (err1) => {
        if (!err1) {
            fs.unlink(addr, (err) => {
                if (!err) {
                    {
                        req.files.Instit_Image.mv("./public/images/platform/" + req.params.who + ".jpg")
                            .then(() => {
                                console.log("successfully updated the platform image");
                                db.edit_plat(req.params.who, req.body)
                                    .then(() => {
                                        let dash = req.session[req.params.who + "_principal"].data.dash_smg;
                                        req.body.dash_smg = dash;
                                        req.session[req.params.who + "_principal"].data = {
                                            ...req.session[req.params.who + "_principal"].data,
                                            ...req.body
                                        };
                                        console.log(req.session[req.params.who + "_principal"], "  new session");
                                        res.json({ err: false });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        res.json({ err: "error occured while edting the platform" });
                                    });
                            })
                            .catch((err) => {
                                console.log("error occured in updating platform image ", err);
                                res.json({ err: "error occured in updating platform image" });

                            });
                    }
                }
            });
        } else {
            req.files.Instit_Image
                .mv("./public/images/platform/" + req.params.who + ".jpg")
                .then(() => {
                    db.edit_plat(req.params.who, req.body).then(() => {
                        let dash = req.session[req.params.who + "_principal"].data.dash_smg;
                        req.body.dash_smg = dash;
                        req.session[req.params.who + "_principal"].data = {
                            ...req.session[req.params.who + "_principal"].data,
                            ...req.body
                        };
                        console.log(req.session[req.params.who + "_principal"], "  new session");
                        res.json({ err: false });
                    }).catch((err) => {
                        console.log(err);
                        res.json({ err: "error occured while edting the platform" });
                    });

                })
                .catch((err) => {
                    console.log("error occured in updating platform image,11", err);
                });
        }
    });
});

module.exports = router;
