const db = require('../Config/connection');
const {
    hashSync,
    compare
} = require('bcrypt');
const secret = require('../Config/const');
const {
    sign
} = require('jsonwebtoken');

//User SignUp
exports.SignUp = async (req, res) => {
    try {
        Data = Object.values(req.body);
        console.log(Data);
        [fname, lname, gender, age, email, number, password] = Data; // this same sequence should be followed while entering the values.
        const result = await db.query(`select COUNT(id) from users where email=?`, [email])
        let count = Object.values(result[0]);
        console.log(`count is equals to ${count}`)
        if (count[0] >= 1) {
            res.status(500).json("User Already Exists");
        } else {
            encoded = hashSync(password, 10);
            await db.query(`INSERT INTO users(firstName,lastName,gender,age,email,number,password) VALUES(?,?,?,?,?,?,?)`,
                [fname, lname, gender, age, email, number, encoded])
            res.status(200).json("User Created");
        }
    } catch (err) {
        res.status(400).json({
            err
        });
    }
}


//User
exports.Login = async (req, res) => {
    try {
        let Data = Object.values(req.body);
        [Email, Password] = Data;
        const result = await db.query(`SELECT COUNT(firstName) FROM users where email=?`, [Email]);
        let count = Object.values(result[0])[0];
        console.log(count);
        if (count == 1) {
            db.query(`Select id,email,password from users where email=?`, [Email]);
            console.log(results[0].password);
            compare(Password, results[0].password, (err, result) => {
                if (err) {
                    return err;
                } else if (result) {
                    let payload = {
                        id: results[0].id,
                        email: results[0].email
                    }
                    let token = sign(payload, secret.jwtkey, {
                        expiresIn: "1h"
                    });
                    console.log(token);
                    res.status(200).send({
                        token
                    });
                } else {
                    return res.status(404).json("Invalid Password");
                }

            })
        } else {
            res.send("User Doesn't Exist,PLease SignUp")
        }
    } catch (err) {
        res.status(400).json({
            err
        });
    }
}


exports.getUsersById = async (req, res) => {
    try {
        const result = db.query(`SELECT * FROM users where id=?`, [req.params.id])
        res.status(200).json({ results })

    } catch (err) {
        res.status(404).json({ success: 0, message: err })
    }
}


exports.getUsers = (req, res) => {
    db.query(`SELECT * FROM users`,
        (err, results, feilds) => {
            if (err) {
                return res.status(404).json({
                    success: 0,
                    message: err
                });
            } else {
                return res.status(200).json({
                    results
                });
            }
        })
}


exports.updateUsers = (req, res) => {
    let Data = Object.values(req.body);
    console.log(Data);
    hash(req.body.password, 10, (err, encoded) => {
        if (err) {
            return err;
        } else {
            let [fname, lname, gender, age, email, number, password] = Data;
            db.query(`UPDATE users SET firstName=?,lastName=?,gender=?,age=?,email=?,number=?,password=? where id=?`,
                [fname,
                    lname,
                    gender,
                    age,
                    email,
                    number,
                    encoded,
                    req.params.id //change this req.params.id with userData.id after doing authentication
                ],
                (err, results, feilds) => {
                    if (err) {
                        return res.status(404).json({
                            success: 0,
                            message: err
                        });
                    } else {
                        return res.status(200).json({
                            results
                        });
                    }
                })
        }
    })
}


exports.deleteUser = (req, res) => {
    db.query('Delete from users where id=?', [req.params.id],
        (err, results, feilds) => {
            if (err) {
                return err;
            } else {
                return res.status(200).json("User Deleted");
            }
        })
}