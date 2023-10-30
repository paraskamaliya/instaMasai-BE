const express = require("express");
const postRouter = express.Router();
const { PostModel } = require("../model/post.model");
const { auth } = require("../middleware/auth.middleware");
postRouter.use(auth);


postRouter.get("/", async (req, res) => {
    const { device } = req.query;
    try {
        if (device) {
            const data = await PostModel.find({ username: req.body.username, device: device })
            res.status(200).send(data);
        }
        else {
            const data = await PostModel.find({ username: req.body.username })
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong.", "err": error });
    }
})

postRouter.get("/top", async (req, res) => {
    const { page } = req.query;
    try {
        const i = (page - 1) * 3
        const data = await PostModel.aggregate([{ $sort: { no_of_comments: -1 } }, { $skip: i }, { $limit: 3 }]);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong.", "err": error });
    }
})

postRouter.post("/add", async (req, res) => {
    try {
        const post = new PostModel(req.body);
        await post.save()
        res.status(200).send({ "message": "New post added", "post": post });
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error });
    }
})

postRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    const post = await PostModel.findOne({ _id: id })
    try {
        if (post.userId == req.body.userId) {
            await PostModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).send({ "message": "Post updated" })
        }
        else {
            res.status(201).send({ "message": "You are not authorized." })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong.", "err": error });
    }
})

postRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const post = await PostModel.findOne({ _id: id })
    try {
        if (post.userId == req.body.userId) {
            await PostModel.findByIdAndDelete({ _id: id });
            res.status(200).send({ "message": "Post deleted" })
        }
        else {
            res.status(201).send({ "message": "You are not authorized." })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong.", "err": error });
    }
})

module.exports = { postRouter };