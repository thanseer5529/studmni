const mongodb = require("mongodb");
const offline = "mongodb://localhost/27017";
const db_status = {
    connection: null,
};
module.exports = {
    dbs: function () {
        return new Promise((resolve, reject) => {
            mongodb.MongoClient.connect(offline, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    db_status.connection = data;
                    resolve(data);
                }
            });
        });
    },
    get_db: function () {       
        return new Promise((resolve) => {
            // console.log("vokkey");
            if (db_status.connection === null)
            {                
                tt = setInterval(() => {
                    console.log("did not");
                    if (db_status.connection !== null) {
                        // console.log("returned late")
                        resolve(db_status.connection);
                        clearInterval(tt);
                    }
                }, 500);           
            }
            else if (db_status.connection !== null) {
                // console.log("returned on time")
                resolve(db_status.connection);
        }
             else {
                console.log("something went wrong on fetching db");
            }
        });
    },      
};