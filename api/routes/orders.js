const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .then((orders) => {
      response = {
        count: orders.length,
        orders: orders.map((order) => {
          return {
            product: order.product,
            quantity: order.quantity,
            _id: order._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + order._id,
            },
          };
        }),
      };
      console.log(orders);
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  console.log("searching for product");
  Product.findById(req.body.productId)
    .then((product) => {
      console.log(product);

      if (!product) {
        console.log("product not found");
        return res.status(404).json({
          message: "product not found",
        });
      }
      const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity,
      });
      order
        .save()
        .then((response) => {
          res.status(201).json({
            message: "Order was created",
            order: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .then((ord) => {
      res.status(200).json({
        message: "Order details",
        order: ord,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  Order.deleteOne({ _id: id })
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  res.status(200).json({
    message: "Orders were deleted",
    orderId: req.params.orderId,
  });
});

module.exports = router;
