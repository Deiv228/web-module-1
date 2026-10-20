const { randomUUID } = require("node:crypto");

function makeOrderId() {
  return `ord-${randomUUID().slice(0, 8)}`;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTotal(items) {
  return roundMoney(
    items.reduce((sum, item) => sum + item.quantity * item.price, 0),
  );
}

function copyItem(item) {
  return {
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  };
}

function orderResponse(order) {
  return {
    id: order.id,
    customerName: order.customerName,
    items: order.items.map(copyItem),
    total: order.total,
    status: order.status,
  };
}

function normalizeItems(items) {
  return items.map((item) => ({
    name: item.name.trim(),
    quantity: item.quantity,
    price: item.price,
  }));
}

function validationProblem(message, details) {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message,
      details,
    },
  };
}

function notFoundProblem() {
  return {
    error: {
      code: "ORDER_NOT_FOUND",
      message: "Order not found",
    },
  };
}

module.exports = {
  makeOrderId,
  calculateTotal,
  orderResponse,
  normalizeItems,
  validationProblem,
  notFoundProblem,
};
