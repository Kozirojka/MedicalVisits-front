// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      
      // Перенаправлення в залежності від ролі
      switch (userData.role) {
        case 'Doctor':
          navigate('/doctor');
          break;
        case 'Patient':
          navigate('/patient');
          break;
        case 'Admin':
          navigate('/admin');
          break;
        default:
          setError('Невідома роль користувача');
      }
    } catch (err) {
      setError('Помилка входу. Перевірте email та пароль.');
    }
  };

  return (
    <div className="login-container">
      <h2>Вхід в систему</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
}