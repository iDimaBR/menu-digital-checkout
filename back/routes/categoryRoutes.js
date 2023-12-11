const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/authToken");
const Category = require("../models/Category");

router.get("/", verifyToken, async (req, res) => {
    try {
        const categories = await Category.findAll({ include: User });
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Erro na listagem de categorias",
                error,
            });
    }
});

router.post("/create", verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.userId;

        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res
                .status(404)
                .json({ success: false, message: "Usuário não encontrado" });
        }

        const existingCategory = await Category.findOne({where: { name, userId }});
        if (!existingCategory) {
            return res
                .status(201)
                .json({ success: false, message: "Categoria já existente" });
        }

        const newCategory = await Category.create({ name, userId: userId });

        return res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Erro na criação da categoria",
                error,
            });
    }
});

router.get('/:username', verifyToken, async (req, res) => {
    try {
      const { username } = req.params;
  
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }
  
      const categories = await Category.findAll({ where: { userId: user.id } });
  
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Erro na listagem de categorias', error });
    }
  });

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = req.params.id;
        const userId = req.userId;

        const existingCategory = await Category.findOne({
            where: { id: categoryId, UserId: userId },
        });
        if (!existingCategory) {
            return res
                .status(404)
                .json({ success: false, message: "Categoria não encontrada" });
        }

        existingCategory.name = name;

        await existingCategory.save();
        return res
            .status(200)
            .json({ success: true, category: existingCategory });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Erro ao atualizar a categoria",
                error,
            });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.userId;

        const existingCategory = await Category.findOne({
            where: { id: categoryId, UserId: userId },
        });
        if (!existingCategory) {
            return res
                .status(404)
                .json({ success: false, message: "Categoria não encontrada" });
        }

        await existingCategory.destroy();
        return res
            .status(200)
            .json({ success: true, message: "Categoria excluída com sucesso" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Erro ao excluir categoria",
                error,
            });
    }
});

module.exports = router;
