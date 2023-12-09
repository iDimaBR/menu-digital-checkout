const express = require('express');
const router = express.Router();
//const jwt = require('jsonwebtoken');
const Product = require('../models/product');
const User = require('../models/user');
require('dotenv').config();
const verifyToken = require('../middlewares/authToken');
const Category = require('../back/models/Category');

router.post('/create', verifyToken, async (req, res) => {
    try {
        const { name, price, description, image, categoryId } = req.body;
        const userId = req.userId;

        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        const existingCategory = await Category.findByPk(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
        }

        const newProduct = await Product.create({ name, price, description, image, categoryId, UserId: userId });

        return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro na criação do produto' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, price, description, image, categoryId } = req.body;
        const productId = req.params.id;
        const userId = req.userId;

        const existingProduct = await Product.findOne({ where: { id: productId, UserId: userId } });
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado' });
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
        return res.status(500).json({ success: false, message: 'Erro ao atualizar o produto' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.userId;

        const existingProduct = await Product.findOne({ where: { id: productId, UserId: userId } });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Produto não encontrado ou não pertence ao usuário' });
        }

        await existingProduct.destroy();
        return res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao excluir o produto' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const products = await Product.findAll({ include: { model: User } });
        return res.status(201).json({ success: true, products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro na listagem de produtos' });
    }
});

module.exports = router;
