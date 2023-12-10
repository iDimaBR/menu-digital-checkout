const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Preference } = require("mercadopago");
require("dotenv").config();

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.post("/checkout", async (req, res) => {
    try {
        const { items } = req.body;

        const itemsForMercadoPago = items.map((item) => ({
            title: item.name,
            description: item.description,
            quantity: item.quantity,
            currency_id: "BRL",
            unit_price: item.price,
        }));

        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: itemsForMercadoPago,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Pedido efetuado!",
            url: response.init_point,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao realizar pagamento",
            error: error.message,
        });
    }
});

module.exports = router;
