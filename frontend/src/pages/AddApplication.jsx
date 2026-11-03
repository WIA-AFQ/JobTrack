
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './AddApplication.css'

function AddApplication() {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    application_date: '',
    status: 'pending',
    job_url: '',
    notes: '',
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      await api.post('/applications', formData)
      navigate('/applications')
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors)
          .flat()
          .join(' ')

        setMessage(errors)
      } else {
        setMessage('Unable to save application. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.log('Logout request failed.')
    } finally {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  return (
    <div className="create-layout">

      <aside className="create-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">💼</span>
          <h2>JobTrack</h2>
        </div>

        <nav className="sidebar-menu">
          <Link to="/dashboard" className="sidebar-link">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/applications" className="sidebar-link">
            <span>▤</span>
            My Applications
          </Link>

          <Link
            to="/applications/create"
            className="sidebar-link active"
          >
            <span>＋</span>
            Add Application
          </Link>

          <button
            type="button"
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </nav>

        <div className="sidebar-promo">
          <div className="promo-illustration">👩‍💻</div>
          <h3>Build your career step by step!</h3>
        </div>
      </aside>

      <main className="create-page">

        <header className="create-header">
          <div>
            <Link to="/applications" className="back-link">
              ← Back to Applications
            </Link>

            <h1>Add New Application</h1>
            <p>Track your job application details.</p>
          </div>

          <div className="create-header-icon">💼</div>
        </header>

        <form className="create-form" onSubmit={handleSubmit}>

          <div className="form-field">
            <label>Company <span>*</span></label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name..."
              required
            />
          </div>

          <div className="form-field">
            <label>Position <span>*</span></label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter job position..."
              required
            />
          </div>

          <div className="form-field">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location (e.g. Rabat)..."
            />
          </div>

          <div className="form-field">
            <label>Application Date <span>*</span></label>
            <input
              type="date"
              name="application_date"
              value={formData.application_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Status <span>*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-field">
            <label>Job URL (Optional)</label>
            <input
              type="url"
              name="job_url"
              value={formData.job_url}
              onChange={handleChange}
              placeholder="https://example.com/job"
            />
          </div>

          <div className="form-field notes-field">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this application..."
              rows="4"
            />
          </div>

          {message && (
            <p className="create-error">{message}</p>
          )}

          <div className="create-actions">
            <Link to="/applications" className="cancel-button">
              ✕ Cancel
            </Link>

            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : '+ Save Application'}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}

export default AddApplication
