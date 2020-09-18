const db = require("../Config/connection");


exports.getOrders = (req, res) => {
    db.query(" select * from orders ",
        (err, results, fields) => {
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



exports.getOrder = (req, res) => {
    db.query("select * from orders where o_id=?", [req.params.id],
        (err, results, fields) => {
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



exports.Order = async (req, res) => {
    try {
        const Data = Object.values(req.body);
        console.log(Data);
        [u_id, p_id, quantity] = Data;
        const result = await db.query("Insert into orders(u_id,p_id,quantity) values(?,?,?)", [u_id, p_id, quantity]);
        console.log(result)
        const product = await db.query("select pquantity from products where pid=?", [p_id]);
        new_quantity = product[0].pquantity - quantity;
        console.log("new_quantity",new_quantity);
        if (new_quantity >= 0) {
            await db.query("update products set pquantity=? where pid=?", [new_quantity, p_id]);
            res.status(200).json(result);
        }
        else
            res.send("Available Products are not Sufficient");
    } catch (err) {
        res.status(404).json({
            err
        });
    }
}



exports.delOrder = async (req, res) => {
   try{
    let result = await db.query('select count(o_id) from orders where o_id=?',[req.params.id]);
    const count = Object.values(result[0])[0]
    if(count){
       let result = await db.query('Delete from orders where o_id=?', [req.params.id])
        res.status(200).json({
            message : "User Deleted",
            result
        })
    }
    else{
        res.status(400).send("This Order Doesn't Exist");
    }
   }
   catch(err){
       res.status(400).json({ err });
   }
}



exports.one = async (req, res) => {
    try {
        const result = await db.query("select distinct u_id from orders where p_id=?", [req.params.id]);
        var abc = []
        for (i of result) {
            const result1 = await db.query("select * from users where id=?", [i.u_id])
            console.log(result1[0])
            abc.push(result1[0])
        }
        return res.json(abc);
    } catch (err) {
        res.status(404).json({
            err
        });
    }

}



exports.two = async (req, res) => {
    try {
        const result = await db.query("select distinct p_id from orders where u_id=?", [req.params.id]);
        var abc = []
        for (i of result) {
            const result1 = await db.query("select * from products where pid=?", [i.p_id])
            console.log(result1[0])
            abc.push(result1[0])
        }
        return res.json(abc);
    } catch (err) {
        res.status(404).json({
            err
        });
    }

}

exports.max = async (req, res) => {
    try {
        const result = await db.query("SELECT p_id FROM orders GROUP BY p_id  ORDER BY COUNT(quantity) DESC");
        console.log('res', result)
        var abc = []
        for (i of result) {
            const result1 = await db.query("select * from products where pid=?", [i.p_id])
            console.log(result1[0])
            abc.push(result1[0])
        }
        return res.status(200).json({
            abc
        });
    } catch (err) {
        return res.status(404).json({
            success: 0,
            message: err
        })
    }


}
exports.update=async (req,res)=>{
    try{data = Object.values(req.body)
    console.log(data)
    let [uid,pid,quantity] = data;
    const result = await db.query("update orders set u_id=?,p_id=?,quantity=?",[uid,pid,quantity]);
    res.status(200).json({result});
    }catch(err){
        res.status(400).json({ err })
    }                         

}