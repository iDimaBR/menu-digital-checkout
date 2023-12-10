import { useForm } from "react-hook-form";
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => { 
    
    interface LoginData {
        username: string;
        password: string;
    }
    
    const { register, handleSubmit } = useForm<LoginData>();
    const { isLoggedIn, login } = useAuth();

    const receiveSubmit = (data: LoginData) => {
        login(data.username, data.password);
    };

    return (
        <form onSubmit={handleSubmit(receiveSubmit)}>
        <h1>Acesse sua conta</h1>
        <input type="text" {...register("username", { required: true })} label="Usuário" />
        <input type="password" {...register("password", { required: true })} label="Senha" />
        <button type="submit">Entrar</button>
      </form>
      );
}