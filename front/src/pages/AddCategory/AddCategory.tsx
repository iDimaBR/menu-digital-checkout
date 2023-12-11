import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { NewCategory } from "../../components/NewCategory/NewCategory";


export const AddCategoryPage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleBack = () => {
        navigate(`/account`);
    }

    return (
        <>
        <h1>Adicionar Categoria</h1>
        <NewCategory />
        </>
    );
}