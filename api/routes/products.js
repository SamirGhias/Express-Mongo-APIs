const express = require("express");
const router = express.Router();

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  console.log("finding all products");
  Product.find()
    .select("name price")
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json({
        message: "Handling GET requests to /products",
        data: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/", (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      const createdProduct = {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result._id,
        },
      };
      console.log(result);
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const product = Product.findById(id)
    .then((doc) => {
      console.log(doc);
      // console.log(product);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No product found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // console.log('Product found!: ', product._doc);
  // if (id === 'special') {
  //   res.status(200).json({
  //     message: 'You discovered the secret ID',
  //     id: id,
  //   });
  // } else {
  //   res.status(200).json({
  //     message: 'You passed an ID',
  //     id: id,
  //   });
  // }
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  console.log(req.body);
  for (const ops of req.body) {
    console.log("inside", ops);
    updateOps[ops.propName] = ops.value;
  }
  console.log("UPDATE THE FOLLOWING: ", updateOps);
  Product.updateOne({ _id: id }, { $set: updateOps })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Updated product",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.deleteOne({ _id: id })
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  // res.status(200).json({
  //   message: 'Deleted product',
  // });
});

module.exports = router;
