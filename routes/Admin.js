const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { updateUser, deleteUser, allUsers } = require("../controllers/userController")
const { allOrders, searchOrder, orderHistoryAll, rejectOrder, acceptOrder, searchByOrderDate } = require("../controllers/orderController");
const { inventory, searchItem, FSN1, FSN2, toInventory, issuedItems, addItem, itemCost1, itemCost2, itemCost3, issuedDecreaser } = require("../controllers/itemController");
const { IssuedItem, deleteIssuedItem, issueItem } = require("../controllers/issuedItemController")

//1.Inventory Route
router.get("/inventory", inventory);
// 2.Get All Orders Route
router.get("/orders", allOrders);
router.get("/searchOrder/:orderId", searchOrder);
//3.Issued Items Route
// router.get("/issuedItems",issuedItems);
router.get("/searchByOrderDate/:orderDate", searchByOrderDate);
//4.Get All Users Route       
router.get("/users", allUsers);

//5.update user
router.patch("/updateUser", updateUser);
//6.Delete User
router.delete("/deleteUser/:username", deleteUser);
router.delete("/rejectOrder/:orderId", rejectOrder);
router.patch("/acceptOrder/:orderId", acceptOrder);
router.patch("/issuedDecreaser/:itemId", issuedDecreaser);

//Issued Item related
router.get("/IssuedItems", IssuedItem);
router.delete("/deleteIssuedItem/:item_id", deleteIssuedItem);
router.post("/issueItem", issueItem);

router.post("/addItem", addItem);
router.get("/searchItem/:itemId", searchItem);

router.get("/fsn1", FSN1);
router.get("/fsn2", FSN2);
router.patch("/toInventory/:item_name", toInventory);

router.get("/C", itemCost1);
router.get("/B", itemCost2);
router.get("/A", itemCost3);

module.exports = router;