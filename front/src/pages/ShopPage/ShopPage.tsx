import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import styles from './ShopPage.module.css';
import UseCart, { Product } from '../../data/UseCart';
import Cart from '../../components/Cart/Cart';

export const ShopPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { AddItem, RemoveItem, clearCart, items } = UseCart();

  function handleAddItem(product: Product) {
    AddItem(product);
    localStorage.setItem('cart', JSON.stringify(items));

    console.log(items)
  }

  function handleRemoveItem(product: Product) {
    RemoveItem(product);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  function handleClearCart(){
    clearCart();
    localStorage.removeItem('cart');
  }

  function getCartTotal() {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function getCartQuantity(product: Product) {
    return items.filter((item) => item.id == product.id).reduce((total, item) => total + item.quantity, 0);
  }

  useEffect(() => {

    const initializeCart = () => {
      const cart = localStorage.getItem('cart');
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
          navigate('/shop/');
        }
      } catch (error) {
        navigate('/shop/');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get(`/product/${username}`);
        if(response.data.redirect){
          navigate(response.data.redirect);
        }

        setProducts(response.data.products || []);
      } catch (error) {
        console.error(error);
      }
    };

    initializeCart();
    fetchUser();
    fetchProducts();
  }, [username, navigate, setProducts, clearCart, AddItem]);

  return (
    <>
    <div className={styles.title}>Produtos de {username} <button onClick={() => handleClearCart()} className={styles.removeFromCartButton}>Limpar carrinho</button></div>
    <div className={styles.container}>
      <div className={styles.productsContainer}>
          {products.map((product: Product) => (
            <div className={styles.productCard} id={product.id} key={product.id}>
              <img src={product.image} alt="Foto" className={styles.productImage} />

              <div className={styles.detailsContainer}>
                <span id={styles.name}>{product.name}</span>
                <span id={styles.price}>Pague apenas {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                <span id={styles.description}>{product.description}</span>
              </div>

              <div className={styles.quantityContainer}>
                <button onClick={() => handleRemoveItem(product)} className={styles.removeFromCartButton}>-</button>
                <span>{getCartQuantity(product)}</span>
                <button onClick={() => handleAddItem(product)} className={styles.addToCartButton}>+</button>
              </div>
            </div>
          ))}
      </div>
      <div className={styles.side_cart}>
        <Cart items={items} total={getCartTotal()} />
      </div>
    </div>
    </>
  );
};
