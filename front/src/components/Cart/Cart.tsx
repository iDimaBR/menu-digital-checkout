import styles from "./Cart.module.css";
import { api } from "../../services/api";

interface CartItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    quantity: number;
}

interface CartProps {
    items: CartItem[];
    total: number;
}

const Cart = ({ items, total }: CartProps) => {
    const handleClickCheckout = async () => {
        try {
            const response = await api.post("/payment/checkout", { items });
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.cart}>
            <div className={styles.title}>Carrinho</div>
            <div className={styles.items}>
                {items.map((item) => (
                    <div className={styles.item} key={item.id}>
                        <span>{item.name}</span>
                        <span>
                            {item.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                minimumFractionDigits: 2,
                            })}
                        </span>
                        <span>{item.quantity}</span>
                    </div>
                ))}
            </div>
            <div className={styles.footer}>
                <div className={styles.total}>
                    Total:{" "}
                    {total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                    })}
                </div>
                <div
                    onClick={handleClickCheckout}
                    className={styles.checkoutButton}
                >
                    Finalizar compra
                </div>
            </div>
        </div>
    );
};

export default Cart;
