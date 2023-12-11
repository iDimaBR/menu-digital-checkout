import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { EditProduct } from "../../components/EditProduct/EditProduct";
import styles from "./EditProduct.module.css";

export const EditProductPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const username = localStorage.getItem("username");

    const handleBack = () => {
        navigate(`/account`);
    };
    
      return (
        <>
          <h1>Editar Produto</h1>
          <EditProduct />
        </>
      );
};
