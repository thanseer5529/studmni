var createError = require("http-errors");

var express = require("express");

var path = require("path");

var cookieParser = require("cookie-parser");

var bodyparser = require("body-parser");

var logger = require("morgan");

var ejslayout = require("express-ejs-layouts");

var fp = require("express-fileupload");

var Index = require("./routes/Index");

var Users = require("./routes/Users");

var Hod = require("./routes/Hod");

var Principal = require("./routes/Principal");

var Admin = require("./routes/Admin");

const db = require("./public/db/db_connect");

const session = require("express-session");

// const { io } = require("socket.io-client");

var app = express();





// console.log(io.n(),"hihi");






db.dbs()
    .then((data) => {
        console.log("database is connected ");
    })
    .catch((err) => {
        console.log("database connection problem :--  ", err);
    });
app.use(
    session({
        secret: "key",
        cookie: { maxAge: 600000000000000000 },
        resave: false,
        saveUninitialized: true,
    })
); 

// view engine setup

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.set("layout", "layout/layout.ejs");

app.use(ejslayout);

app.use(fp());

app.use(logger("dev"));

app.use(express.json());

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", Index);

app.use("/User", Users);

app.use("/Hod", Hod);

app.use("/Principal", Principal);

app.use("/Admin", Admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;



