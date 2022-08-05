const express = require("express");
const router = express.Router();
const db = require("../public/db/Index_db");
let Chat_connection = require("../public/db/chat/Chat_connection");
// let server = Chat_connection.build_chat.server;
// let io = require("socket.io")(server);
router.get("/", function (req, res, next) {
    res.render("Index/Index.ejs");
});

router.get("/About", function (req, res, next) {
    res.render("Index/About.ejs");
});

router.get("/Info", function (req, res, next) {
    res.render("Index/Info.ejs");
});
router.post("/Suggestion", function (req, res, next) {
    let content = req.body;
    let requirements = ["name", "mobile", "suggestion"];
    data = requirements.filter((element) => {
        return content[element] != "";
    });
    data = JSON.stringify(data);
    requirements = JSON.stringify(requirements);
    if (data == requirements) {
        if (req.files) content.image_count = Object.keys(req.files).length;
        else content.image_count = 0;
        console.log(content);
        db.suggestiion(content)
            .then((id) => {
                files = req.files;
                count = 0;
                err_check = false;
                if (req.files) {
                    for (let i in req.files) {
                        count++;
                        req.files[i]
                            .mv("./public/images/suggestion/" + id + "_" + count + ".jpg")
                            .then(() => {
                                console.log("suggestion image uploaded" + count);
                            })
                            .catch((err) => {
                                console.log("error in suggestion image upload" + err);
                                err_check = true;
                                console.log("suggestion image upload error " + count);
                            });
                    }
                    if (!err_check) res.json({});
                    else res.json({ msg: "some or all of the image did not uploaded" });
                } else {
                    res.json({});
                }
            })
            .catch((err) => {
                console.log("error", err);
                res.json({ msg: err });
            });
    } else {
        res.json({ msg: "something problems in input" });
    }
});

router.post("/starting", function (req, res, next) {
    console.log(req.body);
    db.login_plat(req.body)
        .then((data) => {
            if (data.who == "principal") {
                req.session[data.data.Instit_Name + "_" + data.who] = data;
                console.log(data, "session data");
                res.json({ instit: data.data.Instit_Name, who: data.who });
            } else if (data.who == "Hod") {
                req.session[data.data.Instit_Name + "_" + data.who + "_" + data.data.Dept_Name] = data;
                console.log(data, "session data");
                res.json({ instit: data.data.Instit_Name, dept: data.data.Dept_Name, who: data.who });
            } else if (data.who == "User") {
                console.log(data, "user login response");
                data.data.push({ Insti_Name: req.body.Insti, Dept: req.body.Dept });

                req.session[
                    data.data[1].Insti_Name + "_" + data.who + "_" + data.data[1].Dept + "_" + data.data[0].reg_no
                ] = data;
                console.log(data, "session data");
                res.json({
                    instit: data.data[1].Insti_Name,
                    dept: data.data[1].Dept,
                    who: data.who,
                    candidate: data.data[0].reg_no,
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
});
router.get("/Create_platform", function (req, res, next) {
    res.render("Index/Create_platform");
});
router.post("/Create_platform", function (req, res, next) {
    db.create_plat(req.body)
        .then((data) => {
            if (data.status == "already") {
                res.json({ status: "already use this platform name" });
            } else if (data.status == "unique") {
                if (req.files.Instit_Image) {
                    image = req.files.Instit_Image;
                    image
                        .mv("./public/images/platform/" + req.body.Instit_Name + ".jpg")
                        .then(() => {
                            console.log("platform image is uploaded");
                    

                            let temp = req.body;
                            let keys = Object.keys(temp);
                            let filter = [];
                            console.log(keys, "keys");
                            keys.forEach((el) => {
                                if (el.startsWith("Dept_Name")) filter.push(temp[el]);
                            });
                            let chat_data = { plat: temp.Instit_Name, dept: filter };
                            console.log("deptsss", chat_data);
                          
                        })
                        .catch((err) => {
                            console.log("something went wrong while uploading platform iamge" + err);
                            res.json({ status: "failed to upload image" });
                        });
                }
                req.session[data.data.Instit_Name + "_" + data.who] = data;
                console.log(data, "session data");
                res.json(data.data.Instit_Name);
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "faild to create platform " });
        });
});

module.exports = router;
