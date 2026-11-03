import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await api.post('/login', {
        email,
        password,
      })

      localStorage.setItem('token', response.data.token)

      navigate('/dashboard')
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message)
      } else {
        setMessage('Connection error. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

 return (
  <div className="auth-page">

    <div className="auth-visual">
      <div className="auth-brand">JobTrack.</div>

      <h2>Take control of your career journey.</h2>

      <p>
        Organize your job applications, track your progress
        and never miss an opportunity.
      </p>
    </div>

    <div className="auth-form-side">
      <div className="auth-card">

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Login to continue your journey with JobTrack.
        </p>

        <form onSubmit={handleLogin} className="auth-form">

          <div>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Account'}
          </button>

        </form>

        {message && (
          <p className="auth-message">{message}</p>
        )}

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>

      </div>
    </div>

  </div>
)
}

export default Login