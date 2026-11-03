
import { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import '../Auth.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
      })

      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors)
          .flat()
          .join(' ')

        setMessage(errors)
      } else if (error.response?.data?.message) {
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

      {/* LEFT SIDE */}
      <div className="auth-visual">
        <div className="auth-brand">JobTrack.</div>

        <h2>Take control of your career journey.</h2>

        <p>
          Organize your job applications, track your progress
          and never miss an opportunity.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-side">
        <div className="auth-card">

          <h1>Create your JobTrack account</h1>

          <p className="auth-subtitle">
            Register to start tracking your job applications.
          </p>

          <form onSubmit={handleRegister} className="auth-form">

            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label>Email</label>
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
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          {message && (
            <p className="auth-message">{message}</p>
          )}

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Register
