import { useEffect, useState } from "react";
import { NewProduct } from "../../components/NewProduct/NewProduct";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export const AddProductPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const username = localStorage.getItem("username");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await api.get(`/user/${username}`);
                if (userResponse.status === 404 || !userResponse.data.isOwner) {
                    navigate("/shop/");
                }

                const categoriesResponse = await api.get(
                    `/category/${username}`
                );
                setCategories(categoriesResponse.data.categories || []);
            } catch (error) {
                console.error(error);
                navigate("/shop/");
            }
        };

        fetchData();
    }, [navigate, username]);

    return (
        <>
            <h1>Adicionar produto</h1>
            <NewProduct categories={categories} />
        </>
    );
};
