require('dotenv').config();
import styles from './Cart.module.css';
import mercadopago from 'mercadopago';

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
        mercadopago.configure({
          access_token: process.env.MP_TOKEN,
        });
    
        const itemsForMercadoPago = items.map(item => ({
          title: item.name,
          description: item.description,
          quantity: item.quantity,
          currency_id: 'BRL',
          unit_price: item.price,
        }));
    
        const preference = {
          items: itemsForMercadoPago,
        };
    
        const response = await mercadopago.preferences.create(preference);

        console.log(response);

        window.location.href = response.body.init_point;
    };

    return (
        <div className={styles.cart}>
            <div className={styles.title}>Carrinho</div>
            <div className={styles.items}>
                {items.map((item) => (
                    <div className={styles.item} key={item.id}>
                        <span>{item.name}</span>
                        <span>{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}</span>
                        <span>{item.quantity}</span>
                    </div>
                ))}
            </div>
            <div className={styles.footer}>
                <div className={styles.total}>Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}</div>
                <div onClick={handleClickCheckout} className={styles.checkoutButton}>Finalizar compra</div>
            </div>
        </div>
    );
};

export default Cart;
