const pool = require("../../config/database");

module.exports = {
    create: (data, callback) => {
        pool.query(
            `insert into users(username, email, password)
                         values(?,?,?)`,

            [
                data.username,
                data.email,
                data.password
            ],
            (error, results, fields) =>{
                if(error){
                    return callback(error);
                }else{
                    return callback(null, results);
                }
            }
        )
    },
    getUsers: callback =>{
        pool.query(
            `select id,username,email,password from users`,
            [],
            (error,results, feilds) => {
                if(error){
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    getUserByUserId: (id, callback) => {
        pool.query(
            `select id, username, email, password from users where id =?`,
            [id],
            (error, results, fields) =>{
                if(error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        );
    },
    updateUsers: (data, callback) =>{
        pool.query(
            `update users set username=?, email=?, password=? where id=?`,
        [
            data.username,
            data.email,
            data.password,
            data.id
        ],
        (error, results, feilds) =>{
            if(error){
                callback(error);
            }
            return callback(null, results);
        }
        );
    },
    deleteUser: (data, callback) => {
        pool.query(
            `delete from users where id = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                // Check if rows were affected
                if (results.affectedRows === 0) {
                    // No user found with the given ID
                    return callback(null, { message: "No user found with the given ID" });
                }
                // User deleted successfully
                return callback(null, { message: "User deleted successfully" });
            }
        );
    },
    
    getUserByEmail: (email, callback) => {
        pool.query(
            `select * from users where email = ?`,
            [email],
            (error,results,fields) =>{
                if(error){
                    callback(error);
                }
                return callback(null,results[0])
            }
        );
    },
    
};