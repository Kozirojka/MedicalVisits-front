import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login/Login.css';


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
    <div className="loginContainer">
    <div className="formWrapper">
      <h2 className="title">Вхід в систему</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="inputGroup">
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password" className="label">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="submitButton">Увійти</button>
      </form>
      <div className="registerLink">
           <br/>
          <p>Ще не зареєстровані? <br/>
            <Link to="/register">Зареєструйтесь тут</Link></p>
        </div>
    </div>
  </div>
  )  
}
