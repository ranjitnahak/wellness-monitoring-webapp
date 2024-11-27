import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { AuthCallback } from './components/auth/AuthCallback';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
