import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from '@/pages/login';

jest.mock('axios');

jest.mock("next/navigation", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }}));

describe('Login', () => {
  test('renders Login component', () => {
    render(<Login />);
    
    // Verifica se o componente é renderizado corretamente
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('exibe erro ao fazer login', async () => {
    axios.post.mockRejectedValue(new Error('Login error'));
    
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText('Usuário:'), { target: { value: 'username' } });
    fireEvent.change(screen.getByLabelText('Senha:'), { target: { value: 'password' } });
    
    fireEvent.click(screen.getByText('Entrar'));
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao fazer login')).toBeInTheDocument();
    });
  });
});
