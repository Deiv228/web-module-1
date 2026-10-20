const { orders } = require("../data/store");
const { validateCreateOrder } = require("../utils/validators");
const {
  makeOrderId,
  calculateTotal,
  normalizeItems,
  orderResponse,
  validationProblem,
  notFoundProblem,
} = require("../utils/helpers");

const DEFAULT_ORDER_STATUS = "created";

function createOrder(req, res, next) {
  try {
    const validationErrors = validateCreateOrder(req.body);

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json(validationProblem("Invalid order", validationErrors));
    }

    const normalizedCustomerName = req.body.customerName.trim();
    const items = normalizeItems(req.body.items);
    const serverCalculatedTotal = calculateTotal(items);

    const newOrder = {
      id: makeOrderId(),
      customerName: normalizedCustomerName,
      items,
      total: serverCalculatedTotal,
      status: DEFAULT_ORDER_STATUS,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return res
      .status(201)
      .location(`/orders/${newOrder.id}`)
      .json(orderResponse(newOrder));
  } catch (error) {
    return next(error);
  }
}

function getAllOrders(req, res) {
  const result = orders.map((order) => orderResponse(order));
  res.status(200).json({
    orders: result,
    count: result.length,
  });
}

function getOrderById(req, res, next) {
  try {
    const requestedId = req.params.id;
    const matchingOrder = orders.find((order) => order.id === requestedId);

    if (!matchingOrder) {
      return res.status(404).json(notFoundProblem());
    }

    return res.status(200).json(orderResponse(matchingOrder));
  } catch (error) {
    return next(error);
  }
}

function deleteOrder(req, res, next) {
  try {
    const orderId = req.params.id;
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json(notFoundProblem());
    }

    orders.splice(orderIndex, 1);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
};
