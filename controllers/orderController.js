

const Order = require("../models/Order")
const mongoose = require("mongoose")

// getting all order: for admin
exports.allOrders = function (req, res) {
    Order.find(function (err, orders) {
        if (!err) {
            //console.log(orders);
            res.status(200).json({ orders: orders });
        }
        else {
            res.send(err);
        }
    })
}


//getting specific user order History: for user
exports.orderHistoryUser = function (req, res) {
    Order.find({ user_id: req.params.userId }, (err, orders) => {
        if (!err) {
            res.status(200).json({ orders: orders });
        } else {
            res.send(err);
        }
    })
}



// for Searching order by orderid and for Order Details
exports.searchOrder = function (req, res) {
    Order.findOne({ _id: req.params.orderId }).
        populate('user_id').
        exec(function (err, foundOrder) {
            if (!err) {
                console.log(foundOrder);
                res.json({ order: foundOrder });
            }
            else {
                res.send(err)
            }
        });
}
//Search the orders by Date
exports.searchByOrderDate = function (req, res) {

    let date = new Date(req.params.orderDate);
    let date_converted = date.toDateString();

    Order.find(function (err, orders) {
        if (!err) {

            let result = [];
            let i;
            for (i = 0; i < orders.length; i++) {

                const date_to_be = new Date(orders[i].order_date);
                let temp = date_to_be.toDateString();

                if (temp === date_converted)
                    result.push(orders[i]);
            }

            console.log(result);
            res.send(result);
        }
        else {
            res.send(err);
        }
    })

}

//Getting Recent Orders: to be display in user dashboard
exports.recentOrder = (req, res) => {
    const user_id = req.params.userId
    var query = { order_date: -1 }; // we have to take the item_id of the item which we want to add into inventory. 
    Order.find({ user_id: user_id }).sort(query).exec(function (err, result) {
        if (err)
            throw err;
        //console.log(result);
        res.status(200).send({ order: result[0] ?? ({}) });
    });
}



//User order items :only user
exports.orderItem = async (req, res) => {
    console.log(req.body);
    try {
        const newOrder = await new Order({
            _id: new mongoose.Types.ObjectId(),
            user_id: req.body.user_id,
            item_count: req.body.item_count,
            remark: req.body.remark,
            order_date: Date.now(),
            total_cost: req.body.total_cost,
            issued_items: req.body.issued_items,
        });
        const order = await newOrder.save();
        //console.log(order);
        res.status(201).json({ status: 'Succesfully added a new Order', Order: order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'Order Not Added Successfully', order: false, error: err });
    }


}


//Reject Order  Request
exports.rejectOrder = (req, res) => {
    console.log(req.params);
    const order_id = req.params.orderId;
    Order.findByIdAndDelete(order_id, (err) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json("order rejected successfully")
        }
    });
}



// Accept Order Request
exports.acceptOrder = (req, res) => {
    const order_id = req.params.orderId;
    console.log(order_id);
    Order.find({ _id: order_id }, (err, order) => {
        if (!err) {
            if (order) {
                console.log(order)
                const ord = {
                    _id: order._id,
                    item_id: order.item_id,
                    item_count: order.item_count,
                    remark: order.remark,
                    total_cost: order.total_cost,
                    order_date: order.order_date,
                    issued_items: order.issued_items,
                    isVerified: true,
                }
                console.log(ord.isVerified, ord.remark);
                Order.updateOne({ _id: order_id }, { $set: ord }, (err) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json("order verified successfully")
                    }
                });

            } else {
                res.send("order not found");
            }
        } else {
            res.send(err);
        }
    })

}





