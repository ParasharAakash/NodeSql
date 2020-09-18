const db = require('../Config/connection');



exports.createProduct = (req, res) => {

    // converting req.body which is an object into an array Data.    
    // 3 ways to do so object.keys(req.body),object.values(req.body),object.entries(req.body),
    let Data = Object.values(req.body);


    // Array Destructuring  
    let [name, price, image, description, quantity, catid, shortcode] = Data;
    console.log("req.body",req.body);
    console.log('Data', Data);

    /*above 2 steps are done to avoid
    firstName: req.body.first_name,
    lastName:req.body.last_name,
    gender:req.body.gender,
    email:req.body.email,
    password:req.body.password,
    number : req.body.number
    */


    db.query(`SELECT COUNT(pname) FROM products WHERE shortcode=?`, [shortcode],
        (err, results, feilds) => {
            if (err) {
                return err;
            } else {
                ar = Object.values(results[0]);
                if (ar >= 1) {
                    res.status(500).json("product already exists");
                } else {
                    db.query(`insert into products(pname,pprice,pimage,pdescription,pquantity,cid,shortcode) values(?,?,?,?,?,?,?)`,
                        [
                            name,
                            price,
                            image,
                            description,
                            quantity,
                            catid,
                            shortcode
                        ],
                        (err, results, feilds) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({
                                    success: 0,
                                    message: "Database Connection error"
                                });
                            } else {
                                return res.status(200).json({
                                    success: 1,
                                    data: results
                                });
                            };
                        }
                    )
                };
            }
        });
}



//get all products
exports.getProducts = (req, res) => {
    db.query("SELECT * from products", (err, results, fields) => {
        if (!err) {
            return res.status(200).json({
                results
            });
        } else {
            console.log(err);
            return res.status(404).json({
                success: 0,
                message: results
            })
        }
    })
}



//get product by ID
exports.getProduct = (req, res) => {
    db.query(`SELECT * FROM products WHERE pid=?`, [req.params.id],
        (err, results, fields) => {
            if (!err) {
                res.status(200).json({
                    results
                });
            } else {
                console.log(err);
            }
        })
}



//Update products
exports.updateProduct = (req, res) => {
    Data = Object.values(req.body);
    let [name, price, image, description, quantity, catid, shortcode] = Data;
    console.log(Data);
    db.query(`update products set pname=?,pprice=?,pimage=?,pdescription=?,pquantity=?,cid=?,shortcode=? where pid=?`,
        [
            name,
            price,
            image,
            description,
            quantity,
            catid,
            shortcode,
            req.params.id
        ], (err, results, fields) => {
            if (!err) {
                res.status(200).json({
                    results
                });
            } else {
                console.log(err);
            }
        }
    )
}



exports.removeProduct = (req, res) => {
    db.query(`DELETE FROM products WHERE pid=?`, [req.params.id],
        (err, results, feilds) => {
            if (!err) {
                return res.status(200).json({
                    results
                });
            } else {
                return err;
            }
        })
}