import { useForm } from "react-hook-form";
import { useAuth } from '../../contexts/AuthContext';
import styles from './Register.module.css';
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface RegisterData {
    shop: string;
    username: string;
    password: string;
}

export const RegisterPage = () => { 
    
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<RegisterData>();
    const { isLoggedIn, newUser, message } = useAuth();

    const receiveSubmit = (data: RegisterData) => {
        newUser(data.shop, data.username, data.password);
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit(receiveSubmit)}>
        <h1>Criar conta</h1>
        <input className={styles.textbox} type="text" {...register("shop", { required: true })} placeholder="Nome da Loja" />
        <input className={styles.textbox} type="text" {...register("username", { required: true })} placeholder="Usuário" />
        <input className={styles.textbox} type="password" {...register("password", { required: true })} placeholder="Senha" />
        <div className={styles.divider}>
            <button className={styles.button_login} type="button" onClick={() => navigate("/")}>Voltar</button>
            <button className={styles.button_login} type="submit">Registrar</button>
        </div>
        <span className={styles.message}>{message}</span>
      </form>
      );
}