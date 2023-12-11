const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
require("dotenv").config();
const verifyToken = require("../middlewares/authToken");
const Category = require("../models/Category");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

router.get("/id/:id", verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ where: { id: productId } });
        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error,
        });
    }
});

router.get("/:username", verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }

        const products = await Product.findAll({ where: { userId: user.id } });

        return res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro na listagem de produtos",
            error,
        });
    }
});

router.post("/create", verifyToken, async (req, res) => {
    try {
        const { name, price, description, image, categoryId } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }

        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }

        const existingCategory = await Category.findByPk(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ success: false, message: "Categoria não encontrada" });
        }

        const newProduct = await Product.create({
            name,
            price,
            description,
            image,
            categoryId,
            userId: userId,
        });

        return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro na criação do produto",
            error,
        });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { name, price, description, image, categoryId } = req.body;
        const productId = req.params.id;
        const userId = req.userId;

        const existingProduct = await Product.findOne({
            where: { id: productId, UserId: userId },
        });
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Produto não encontrado" });
        }

        existingProduct.name = name;
        existingProduct.price = price;
        existingProduct.description = description;
        existingProduct.image = image;
        existingProduct.categoryId = categoryId;

        await existingProduct.save();
        return res.status(200).json({ success: true, product: existingProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar o produto",
            error,
        });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.userId;

        const existingProduct = await Product.findOne({
            where: { id: productId, userId: userId },
        });
        if (!existingProduct) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        await existingProduct.destroy();
        return res.status(200).json({ message: "Produto excluído com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao excluir o produto", error });
    }
});

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
    const imagePath = req.file.path;

    try {
        const formData = new FormData();
        formData.append("image", require("fs").createReadStream(imagePath));

        const response = await axios.post("https://api.imgur.com/3/image", formData, {
            headers: {
                Authorization: "Client-ID " + process.env.IMGUR_CLIENT_ID,
                ...formData.getHeaders(),
            },
        });

        if (response.data && response.data.data && response.data.data.link) {
            return res.status(201).json({ success: true, url: response.data.data.link });
        }

        return res.status(404).json({ success: false });
    } catch (error) {
        console.error("Erro ao fazer upload para o Imgur:", error);
        return res.status(404).json({ success: false });
    }
});

module.exports = router;
