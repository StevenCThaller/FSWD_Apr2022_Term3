import './App.css';
import { ToastContainer } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import useAuth from './hooks/useAuth';
import Header from './components/Header';
import FriendSearch from './components/FriendSearch';
import { ProvideDashboard } from './hooks/useDashboard';
import ChatWindow from './components/ChatWindow/ChatWindow';

function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="signup" element={<RegisterPage />} />
        <Route path="signin" element={<LoginPage />} />
        <Route path="dashboard" element={
          <ProvideDashboard>
            <Dashboard />
          </ProvideDashboard>
        }>
          <Route path="friendsearch" element={<FriendSearch />} />
          <Route path="chat" element={<ChatWindow />} />
          <Route path="chat/:roomId" element={<ChatWindow />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
