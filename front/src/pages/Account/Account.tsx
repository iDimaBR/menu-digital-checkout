import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import styles from './Account.module.css';
import { CategoryData } from '../../components/NewProduct/NewProduct';

const AccountPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [owner, setOwner] = useState(false);
  const username = localStorage.getItem('username');

  const handleBack = () => {
    navigate(`/shop/${username}`);
  }

  const handleAddProduct = () => navigate(`/shop/${username}/product/add`);
  const handleAddCategory = () => navigate(`/shop/${username}/category/add`);
  
  const handleEditItem = (productId: number) => {
    navigate(`/shop/${username}/product/edit/${productId}`);
  }

  const handleRemoveItem = (id: number) => {
    api.delete(`/product/${id}`).then((response) => {
      if (response.status === 200) {
        setProducts(products.filter((product) => product.id !== id));
      }else{
        alert('Erro ao remover produto');
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get(`/user/${username}`);
        if (userResponse.status === 404 || !userResponse.data.isOwner) {
          navigate('/shop/');
        }
        setOwner(userResponse.data.isOwner);

        const productsResponse = await api.get(`/product/${username}`);
        if (productsResponse.data.redirect) {
          navigate(productsResponse.data.redirect);
        }
        setProducts(productsResponse.data.products || []);

        const categoriesResponse = await api.get(`/category/${username}`);
        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.error(error);
        navigate('/shop/');
      }
    };

    fetchData();
  }, [navigate, username]);

  return (
    <>
            <div className={styles.title}>Minha Conta</div>
            <div className={styles.container}>
                <div className={styles.productsContainer}>
                    {categories.map((category: CategoryData) => (
                        <div className={styles.categoryCard} key={category.id}>
                            <span className={styles.categoryName}>Categoria: {category.name}</span>
                            <div className={styles.productGrid}>
                                {products
                                    .filter((product: Product) => product.categoryId === category.id)
                                    .map((product: Product) => (
                                        <div className={styles.productCard} id={product.id} key={product.id}>
                                            <img src={product.image} alt="Foto" className={styles.productImage} />
                                            <div className={styles.detailsContainer}>
                                                <span id={styles.name}>{product.name}</span>
                                                <span id={styles.price}>{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                                <span id={styles.description}>{product.description}</span>
                                            </div>
                                            <div className={styles.quantityContainer}>
                                            <button onClick={() => handleEditItem(product.id)} className={styles.addToCartButton}>
                                                Editar
                                              </button>
                                              <button onClick={() => handleRemoveItem(product.id)} className={styles.removeFromCartButton}>
                                                Remover
                                              </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.side_cart}>
                  <button onClick={() => handleBack()} className={styles.addToCartButton}>Voltar</button>
                  <button onClick={() => handleAddProduct()} className={styles.addToCartButton}>Adicionar Produto</button>
                  <button onClick={() => handleAddCategory()} className={styles.addToCartButton}>Adicionar Categoria</button>
                </div>
            </div>
        </>
  );
};

export default AccountPage;
