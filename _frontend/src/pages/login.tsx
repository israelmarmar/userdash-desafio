import React, { useState } from 'react';
import axios from 'axios';
import Header from '@/app/components/Header';
import { RingLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import { useRouter } from 'next/navigation';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const Login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email: username, password });
            localStorage.setItem('access_token', data.access_token);
            router.push('home');
        } catch (error) {
            console.log(error)
            toast.error('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <ToastContainer />
            <main className='main-login'>
                <div className="login-container">
                    <h1>Login</h1>
                    <div>
                        <label htmlFor="username">Usuário:</label>
                        <input type="text" id='username' name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password">Senha:</label>
                        <input type="password" id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleLogin} disabled={loading}>
                        {loading ? <RingLoader color={'#123abc'} loading={loading} size={20} /> : 'Entrar'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
