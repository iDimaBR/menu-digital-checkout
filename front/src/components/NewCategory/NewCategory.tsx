import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import styles from "./NewCategory.module.css";
import { useForm } from "react-hook-form";

interface ProductData {
    name: string;
}

export const NewCategory = () => {
    const { register, handleSubmit } = useForm<ProductData>();
    const navigate = useNavigate();

    const receiveSubmit = async (data: ProductData) => {
        try {
            const response = await api.post("/category/create", data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = () => {
        navigate(`/account`);
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit(receiveSubmit)}>
            <div className={styles.input_group}>
                <span>Nome</span>
                <input className={styles.textbox} {...register("name", { required: true })} />
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
