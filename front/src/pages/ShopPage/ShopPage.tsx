import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import styles from "./ShopPage.module.css";
import UseCart, { Product } from "../../data/UseCart";
import Cart from "../../components/Cart/Cart";
import { CategoryData } from "../../components/NewProduct/NewProduct";
import { useAuth } from "../../contexts/AuthContext";

export const ShopPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [owner, setOwner] = useState(false);
    const { isLoggedIn } = useAuth();

    const [title, setTitle] = useState("");
    const { AddItem, RemoveItem, clearCart, items } = UseCart();

    function handleAddItem(product: Product) {
        AddItem(product);
        localStorage.setItem("cart", JSON.stringify(items));
    }

    function handleRemoveItem(product: Product) {
        RemoveItem(product);
        localStorage.setItem("cart", JSON.stringify(items));
    }

    function handleClearCart() {
        clearCart();
        localStorage.removeItem("cart");
    }

    function getCartTotal() {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function getCartQuantity(product: Product) {
        return items.filter((item) => item.id == product.id).reduce((total, item) => total + item.quantity, 0);
    }

    useEffect(() => {
        const initializeCart = () => {
            const cart = localStorage.getItem("cart");
            if (cart) {
                const parsedCart = JSON.parse(cart);
                clearCart();
                parsedCart.forEach((item: Product) => {
                    AddItem(item);
                });
            }
        };

        const fetchUser = async () => {
            try {
                const response = await api.get(`/user/${username}`);
                if (response.status === 404) {
                    navigate("/shop/");
                }

                setTitle(response.data.user.shop);
                setOwner(response.data.isOwner);
            } catch (error) {
                navigate("/shop/");
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await api.get(`/product/${username}`);
                if (response.data.redirect) {
                    navigate(response.data.redirect);
                }

                setProducts(response.data.products || []);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await api.get(`/category/${username}`);
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error(error);
            }
        };

        initializeCart();
        fetchUser();
        fetchCategories();
        fetchProducts();
    }, [username, navigate, setProducts, clearCart, AddItem]);

    return (
        <>
            <div className={styles.title}>{title}</div>
            <div className={styles.container}>
                <div className={styles.productsContainer}>
                    {categories.map((category: CategoryData) => (
                        <div className={styles.categoryCard} key={category.id}>
                            <span className={styles.categoryName}>{category.name}</span>
                            <div className={styles.productGrid}>
                                {products
                                    .filter((product: Product) => product.categoryId === category.id)
                                    .map((product: Product) => (
                                        <div className={styles.productCard} id={product.id} key={product.id}>
                                            <img src={product.image} alt="Foto" className={styles.productImage} />
                                            <div className={styles.detailsContainer}>
                                                <span id={styles.name}>{product.name}</span>
                                                <span id={styles.price}>Pague apenas {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                                <span id={styles.description}>{product.description}</span>
                                            </div>
                                            <div className={styles.quantityContainer}>
                                                <button onClick={() => handleRemoveItem(product)} className={styles.removeFromCartButton}>
                                                    -
                                                </button>
                                                <span>{getCartQuantity(product)}</span>
                                                <button onClick={() => handleAddItem(product)} className={styles.addToCartButton}>
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.side_cart}>
                {!isLoggedIn && owner && (
                  <button onClick={() => navigate("/account")} className={styles.button}>
                      Minha Conta
                  </button>
                )}
                  <Cart items={items} clearCart={handleClearCart} total={getCartTotal()} />
                </div>
            </div>
        </>
    );
};
