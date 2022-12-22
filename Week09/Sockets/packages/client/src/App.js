import './App.css';
import { ToastContainer } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import useAuth from './hooks/useAuth';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="signup" element={<RegisterPage />} />
        <Route path="signin" element={<LoginPage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
