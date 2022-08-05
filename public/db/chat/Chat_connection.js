// const { Socket } = require("socket.io");

const db = require("../db_connect");
module.exports = {
    build_chat: {
        server: null,
        put_server: function (content) {
            this.server = content;
        },
        call_fn: function (val) {
            make_chat(val);
        },
    },
};





 

x = setInterval(() => {
    if (module.exports.build_chat.server != null) {
        server = module.exports.build_chat.server;
        io = require("socket.io")(server);

        io.on("connection", (socket) => {
            console.log("socket connected");
            socket.on("disconnect", () => {
                console.log("socket disconnecteed");
            })
            socket.on("join_request", (room) => {
                socket.join(room)
                console.log(room);
                socket.emit("join_respond", "you are joined into chat")
            })
            socket.on("hod_send", (room, msg) => {
                console.log("hod to student");
                socket.to(room).emit("hod_receive", msg)
            })
            socket.on("student_send", (room, msg, who) => {
                console.log("student to hod ",room);
                socket.to(room).emit("student_receive", msg,who)
            })
        })

        clearInterval(x);
    } else console.log("server busy to connect socket");
}, 100);











// lol = () => {
//     return new Promise((resolve) => {
//         db.get_db().then((con) => {
//             let chat_array = [];
//             con.db()
//                 .admin()
//                 .listDatabases(async (err, data) => {
//                     for (i of data.databases) {
//                         check = false;
//                         let collection = await con.db(i.name).listCollections().toArray();
//                         for (j of collection) {
//                             if (j.name == "details") {
//                                 check = true;
//                                 break;
//                             }
//                         }
//                         if (check) {
//                             let dept = [];
//                             collection.forEach((el) => {
//                                 if (el.name != "details") {
//                                     dept.push(el.name);
//                                 }
//                             });
//                             chat_array.push({ plat: i.name, dept: dept });
//                         }
//                     }
//                     resolve(chat_array);
//                 });
//         });
//     });
// };

// chat_data = null;
// lol().then((content) => {
//     console.log(content, "content1");
//     chat_data = content;
// });

// var server,
//     io,
//     chat_object = null;
// let chat_fn = null,
//     x = setInterval(() => {
//         if (module.exports.build_chat.server != null) {
//             server = module.exports.build_chat.server;
//             io = require("socket.io")(server);
//             abc();
//             clearInterval(x);
//         } else console.log("server busy to connect socket");
//     }, 100);

// function abc() {
//     let str = ` function myfunc (socket)  {
//         chat_object = socket;
//         console.log("socket connected");
//         socket.on("disconnect", () => {
//             console.log("socket disconnected");
//         });`;
//     y = setInterval(() => {
//         if (chat_data != null) {
//             for (i of chat_data) {
//                 for (j of i.dept) {

//                     str += `
//                         socket.on("${i.plat}_hod_${j}", (msg,who) => {
//                             io.emit("${i.plat}_user_${j}",msg,who);
//                         });
                        
//                         socket.on("${i.plat}_user_${j}_send", (msg,who) => {
//                             io.emit("${i.plat}_hod_${j}_receive",msg,who);
//                         });
//                         `;
//                 }
//             }
//             str += `};`;
//             eval(str);          
//             chat_fn = myfunc;
//             io.on("connection", myfunc);
//             clearInterval(y);
//         }
//     }, 100);
// }

// function make_chat(val) {
//     q = setInterval(() => {
//         if (chat_fn != null)
//         {
//              chat_fn.on(val.plat + "_hod_" + val.dept[0], (msg) => {

//                  k=10
//         });
//         clearInterval(q)
//         }
//         else {
//             console.log("not yet ");
//         }
// },500)
// }
