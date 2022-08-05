const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../public/db/Admin_db");

const fs = require("fs");
const { log } = require("console");

router.get("/", function (req, res, next) {
    db.get_suggestiion()
        .then((content) => {
            console.log(content);
            // fs.readdir(path.join(__dirname, "/../public/images/suggestion"), (err, files) => {
            //     if (err) console.log(err);
            //     else {
            //         console.log(files);
            //         for (let i of content) {
            //             console.log(i._id);
            //               count = 0;
            //             files.forEach((el) => {
            //                 if (el.startsWith(i._id))
            //                    count++;
            //             })
            //             i.image_count = count;
            //         }
            //         console.log(content);
            //     }
            // });
            // res.redirect("/")

            res.render("Admin/Admin_review", { content });
        })
        .catch((err) => {
            console.log(err);
        });
});
module.exports = router;
