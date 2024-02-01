
const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDB")

router.get("/", (req, res) => {
    res.json({ items });
});

router.post("/", (req, res, next) => {
    try {
        if(!req.body.name) throw new ExpressError("Item name is required", 400)
        if(!req.body.price) throw new ExpressError("Item price is required", 400)
        const newItem = { "name": req.body.name, "price": req.body.price }
        items.push(newItem)
        return res.status(201).json({item: newItem})
    } catch (err) {
        return next(err)
    }
})

router.get("/:name", (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name);
        if (foundItem === undefined) {
            throw new ExpressError("Item not found", 404)
        }
        res.json({ item: foundItem });
    } catch (err) {
        return next(err)
    }
})

router.patch("/:name", (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name);
        if (foundItem === undefined) {
            throw new ExpressError("Item not found", 404)
        }
        foundItem.name = req.body.name
        foundItem.price = req.body.price
        res.json({ item: foundItem });
    } catch (err) {
        return next(err)
    }
})

router.delete("/:name", (req, res, next) => {
    try {
        const foundItem = items.findIndex(item => item.name === req.params.name);
        if (foundItem === -1) {
            throw new ExpressError("Item not found", 404)
        }
        items.splice(foundItem, 1)
        res.json({ message: "Deleted" });
    } catch (err) {
        return next(err)
    }
})

module.exports = router;