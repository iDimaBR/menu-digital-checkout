import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "./EditProduct.module.css";
import { useForm } from "react-hook-form";
import { CategoryData, ProductData } from "../NewProduct/NewProduct";
import { useNavigate, useParams } from "react-router-dom";

export const EditProduct = () => {
    const username = localStorage.getItem("username");
    const { register, handleSubmit } = useForm<ProductData>();
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductData | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { productId } = useParams();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBack = () => {
        navigate(`/account`);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get<ProductData>(`/product/id/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCategories = async () => {
            try {
                const categoriesResponse = await api.get<CategoryData[]>(`/category/${username}`);
                setCategories(categoriesResponse.data.categories || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [username, productId]);

    const getImageURL = async (data) => {
        try {
            const formData = new FormData();
            formData.append("image", data.image[0]);
            console.log("formData", formData);
            const response = await api.post("/product/upload", formData);
            console.log(response);
            return response.data.url;
        } catch (error) {
            console.error("Erro ao enviar arquivo:", error);
            return null;
        }
    };

    const receiveSubmit = async (data: ProductData) => {
        console.log(data);
        try {
            const imageURL = await getImageURL(data);
            const response = await api.put(`product/${productId}`, {
                ...data,
                image: imageURL || product?.image,
            });

            if (response.status === 201) {
                alert("Produto editado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao enviar arquivo:", error);
        }
    };

    return (
        product && (
            <form className={styles.container} onSubmit={handleSubmit(receiveSubmit)}>
                <img src={selectedImage || product.image} className={styles.productImage} alt="Imagem do produto" />
                {/* CORRIGIR PROBLEMA DA IMAGEM NÃO ENVIAR PELO POST */}

                <div className={styles.fileInputWrapper}>
                    <label htmlFor="file-upload" className={styles.customFileUpload}>
                        Selecionar foto
                    </label>
                    <input id="file-upload" className={styles.fileInput} type="file" name="image" accept="image/jpeg" />
                </div>

                <div className={styles.input_group}>
                    <span>Nome</span>
                    <input className={styles.textbox} defaultValue={product.name} {...register("name", { required: true })} placeholder="Nome" />
                </div>

                <div className={styles.input_group}>
                    <span>Preço</span>
                    <input className={styles.textbox} defaultValue={product.price} {...register("price", { required: true })} placeholder="Preço" />
                </div>

                <div className={styles.input_group}>
                    <span>Descrição</span>
                    <textarea className={styles.textbox} defaultValue={product.description} {...register("description", { required: true })} placeholder="Descrição" />
                </div>

                <div className={styles.input_group}>
                    <span>Categoria</span>
                    <select className={styles.textbox} {...register("categoryId", { required: true })}>
                        {categories.map((category: CategoryData) => (
                            <option key={category.id} value={category.id} selected={category.id === product.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button className={styles.button} type="submit">
                    Editar
                </button>
                <button className={styles.button} onClick={() => handleBack()}>
                    Voltar
                </button>
            </form>
        )
    );
};
