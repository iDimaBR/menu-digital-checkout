import { useForm } from "react-hook-form";
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';
import { useNavigate } from "react-router-dom";

export interface LoginData {
    username: string;
    password: string;
}

export const LoginPage = () => { 
    
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<LoginData>();
    const { login, message } = useAuth();

    const receiveSubmit = (data: LoginData) => {
        login(data.username, data.password);
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit(receiveSubmit)}>
        <h1>Acesse sua conta</h1>
        <input className={styles.textbox} type="text" {...register("username", { required: true })} placeholder="Usuário" />
        <input className={styles.textbox} type="password" {...register("password", { required: true })} placeholder="Senha" />
        <div className={styles.divider}>
            <button className={styles.button_login} type="button" onClick={() => navigate("/register")}>Cadastrar</button>
            <button className={styles.button_login} type="submit">Entrar</button>
        </div>
        <span className={styles.message}>{message}</span>
      </form>
      );
}