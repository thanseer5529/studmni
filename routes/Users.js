const express = require("express");
const router = express.Router();

const db = require("../public/db/User_db");
function islogin(req, res, next) {
    if (req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate]) next();
    else res.redirect("/");
}

router.get("/:who/:dept/:candidate", islogin, function (req, res, next) {

    let content = req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate];
    res.render("Users/chat_screen", {
        header: { who: "user", data: { plat: req.params.who, dept: req.params.dept, candidate: req.params.candidate } },
        data: { plat: content.data[1].Insti_Name, dept: content.data[1].Dept, user: content.data[0].reg_no,name:content.data[0].name },
    });
});
router.get("/dashboard/:who/:dept/:candidate", islogin, function (req, res, next) {
console.log(req.params.who,req.params.dept);
    db.get_dash_smg(req.params.who, req.params.dept).then((data => {        
        let content = req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate];
        console.log("dat",data[0].to_candidates);
        res.render("Users/dashboard", {
            header: { who: "user", data: { plat: req.params.who, dept: req.params.dept, candidate: req.params.candidate } },
            data: { plat: content.data[1].Insti_Name, dept: content.data[1].Dept, user: content.data[0].reg_no ,dash_smg:data[0].to_candidates},
        });
    })).catch(() => {
    res.send("error while fetching dashboard messages")
})


    
});

router.get("/profile/:who/:dept/:candidate", islogin, function (req, res, next) {
    let content = req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate];

    res.render("Users/Home-screen", {
        header: { who: "user", data: { plat: req.params.who, dept: req.params.dept, candidate: req.params.candidate } },
        data: content,
    });
});

router.post("/update/:who/:dept/:candidate", islogin, function (req, res, next) {
    let content = req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate];
    console.log(req.body);
    console.log(content, "session before update");
    db.update_user(req.body, req.params.who, req.params.dept, req.params.candidate)
        .then(() => {            
            req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate].data[0].name = req.body.name
            req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate].data[0].status = req.body.status
            req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate].data[0].mobile = req.body.mobile
            req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate].data[0].password = req.body.password
            req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate].data[0].verifed="true"
            res.json({ mes: "candidate data updated" });
        })
        .catch((err) => {
            res.json({ err: err.err });
        });
    // let content=req.session[req.params.who + "_" + "User" + "_" + req.params.dept + "_" + req.params.candidate]
    // console.log("update url");
    // console.log(req.body);
    // res.render("Users/Home-screen", { header: { who: "user", data: {plat:req.params.who,dept:req.params.dept,candidate:req.params.candidate}},data:content});
});
module.exports = router;
