const express = require("express");
const ordersController = require("../controllers/ordersController");

const router = express.Router();

router.post("/", ordersController.createOrder);
router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.delete("/:id", ordersController.deleteOrder);

module.exports = router;
