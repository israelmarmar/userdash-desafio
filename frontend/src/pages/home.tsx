import React, { useState, useEffect } from 'react';
import './home.css';
import Header from '@/app/components/Header';
import axios from 'axios';
import PieChart from '@/app/components/PieChart';
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const TablePage = () => {
    const router = useRouter()
    const [data, setData] = useState<any>([]);
    const [graph, setGraph] = useState([]);
    const [novoNome, setNovoNome] = useState('');
    const [novoSobrenome, setNovoSobrenome] = useState('');
    const [novoUsername, setNovoUsername] = useState('');
    const [novoEmail, setNovoEmail] = useState('');
    const [novoPapel, setNovoPapel] = useState('admin'); // Valor padrão 'admin'
    const [novaSenha, setNovaSenha] = useState('');

    const fetchGraph = async () => {
        const token = localStorage.getItem('access_token');

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                const data = response.data.map((d: any) => Object.assign({ label: d.role, value: parseInt(d.count) }))
                setGraph(data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                if (error.response.status === 401)
                    router.push('/login');
            });
    }

    const fetchData = ()=>{
        const token = localStorage.getItem('access_token');

        console.log(token)
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setData(response.data))
            .catch(error => {
                console.error('Error fetching users:', error);
            });

    }

    useEffect(() => {
        fetchData();
        fetchGraph();
    }, []);

    const updateRole = (id: number, role: string) => {
        const token = localStorage.getItem('access_token');

        axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, { name: novoNome, lastname: novoSobrenome, 
            username: novoUsername, email: novoEmail, 
            role: novoPapel, password: novaSenha  }, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error('Error update: ', error);
            });
    }

    const newUser = () => {
        const token = localStorage.getItem('access_token');
        const newUser: any = {
            name: novoNome, lastname: novoSobrenome,
            username: novoUsername, email: novoEmail,
            role: novoPapel, password: novaSenha
        };

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, newUser, { headers: { Authorization: `Bearer ${token}` } })
            .then((response: any) => {
                console.log(response)
                clearForm();
                setData([...data, response.data])
            })
            .catch(error => {
                console.error('Error update: ', error);
            });
    }

    const deleteUser = (id: number) => {
        const token = localStorage.getItem('access_token');
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response)
                fetchData();
            })
            .catch(error => {
                console.error('Error update: ', error);
            });
    }

    const handleRoleChange = (index: number, id: number, role: string) => {
        const newData: any = [...data];
        const row: any = data[index];
        row.role = role;
        newData[index] = row;
        updateRole(id, role);
        setData(newData);
    }

    const clearForm = () => {
        setNovoNome('');
        setNovoSobrenome('');
        setNovoUsername('');
        setNovoEmail('');
        setNovoPapel('admin');
        setNovaSenha('');
    };

    return (
        <div>
            <Header />
            {graph.length > 0 && <PieChart data={graph} />}
            {data.length > 0 && <>
                <div className="user-container">
                    <label>Nome</label>
                    <input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                    <label>Sobrenome</label>
                    <input type="text" value={novoSobrenome} onChange={(e) => setNovoSobrenome(e.target.value)} />
                    <label>Username</label>
                    <input type="text" value={novoUsername} onChange={(e) => setNovoUsername(e.target.value)} />
                    <label>Email</label>
                    <input type="text" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} />
                    <label>Papel</label>
                    <select value={novoPapel} onChange={(e) => setNovoPapel(e.target.value)}>
                        <option value="admin">admin</option>
                        <option value="cancelled">cancelled</option>
                        <option value="user">user</option>
                    </select>
                    <label>Senha:</label>
                    <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                    <button onClick={newUser}>+ Novo Usuário</button>
                </div>
                <table className='custom-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Nome</th>
                            <th>Sobrenome</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? 'white-row' : 'gray-row'}>
                                <td>{item.id}</td>
                                <td>{item.username}</td>
                                <td>{item.name}</td>
                                <td>{item.lastname}</td>
                                <td>{item.email}</td>
                                <td>
                                    <select
                                        value={item.role}
                                        onChange={(e) => handleRoleChange(index, item.id, e.target.value)}
                                    >
                                        <option value="admin">admin</option>
                                        <option value="cancelled">cancelled</option>
                                        <option value="user">user</option>
                                        {/* Render other role options here */}
                                    </select>
                                </td>
                                <td><button onClick={()=>deleteUser(item.id)}><FontAwesomeIcon icon={faTrash} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table></>}
        </div>
    );
};

export default TablePage;
