import { useNavigate } from "react-router-dom";
import { api, normalApi } from "../../services/api";
import styles from "./NewProduct.module.css";
import { useForm } from "react-hook-form";

export interface ProductData {
    id: number;
    name: string;
    price: number;
    description: string;
    image: FileList;
    categoryId: number;
}

export interface CategoryData {
    id: number;
    name: string;
}

interface ProductProps {
    categories: CategoryData[];
}

export const NewProduct = ({ categories }: ProductProps) => {
    const { register, handleSubmit } = useForm<ProductData>();
    const navigate = useNavigate();

    const getImageURL = async (data) => {
        try {
            const formData = new FormData();
            formData.append("image", data.image[0]);

            const response = await api.post("/product/upload", formData);

            return response.data.url;
        } catch (error) {
            return null;
        }
    };

    const receiveSubmit = async (data: ProductData) => {
        try {
            const imageURL = await getImageURL(data);
            const response = await api.post("/product/create", {
                ...data,
                image: imageURL,
            });

            if (response.status === 201) {
                alert("Produto cadastrado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao enviar arquivo:", error);
        }
    };

    const handleBack = () => {
        navigate(`/account`);
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit(receiveSubmit)}>
            <div className={styles.fileInputWrapper}>
                    <label htmlFor="file-upload" className={styles.customFileUpload}>
                        Selecionar foto
                    </label>
                    <input id="file-upload" className={styles.fileInput} type="file" name="image" accept="image/jpeg" />
                </div>

                <div className={styles.input_group}>
                    <span>Nome</span>
                    <input className={styles.textbox} {...register("name", { required: true })} />
                </div>

                <div className={styles.input_group}>
                    <span>Preço</span>
                    <input className={styles.textbox} {...register("price", { required: true })} />
                </div>

                <div className={styles.input_group}>
                    <span>Descrição</span>
                    <textarea className={styles.textbox} {...register("description", { required: true })} />
                </div>

                <div className={styles.input_group}>
                    <span>Categoria</span>
                    <select className={styles.textbox} {...register("categoryId", { required: true })}>
                        {categories.map((category: CategoryData) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button className={styles.button} type="submit">
                    Adicionar
                </button>
                <button className={styles.button} onClick={() => handleBack()}>
                    Voltar
                </button>
        </form>
    );
};
