const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const verifyToken = require("../middlewares/authToken");
require("dotenv").config();

router.get("/", verifyToken, async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Erro na listagem de usuários",
                error,
            });
    }
});

router.get("/:username", verifyToken, async (req, res) => {
    try {
        const username = req.params.username;
        const userId = req.userId;
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "Usuário não encontrado" });
        }

        const owner = userId === user.id;
        
        return res.status(200).json({ success: true, isOwner: owner, user });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Erro na listagem de usuário",
                error,
            });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { shop, username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            shop,
            username,
            password: hashedPassword,
        });
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(201).json({ success: true, user: newUser, token });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Erro no registro de usuário",
                error,
            });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(201).json({ message: "Credenciais inválidas" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(201).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        return res.status(201).json({ success: true, user, token });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Erro no login", error });
    }
});

module.exports = router;
