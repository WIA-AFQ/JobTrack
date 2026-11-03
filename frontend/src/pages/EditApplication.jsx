import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../services/api'
import "./EditApplication.css"
function EditApplication() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    application_date: '',
    status: 'pending',
    job_url: '',
    notes: '',
  })
console.log('Form values:', formData);
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchApplication = async () => {
      try {
       const response = await api.get(`/applications/${id}`)
       console.log('Application data:', response.data.data)
       setFormData(response.data.data)
      } catch (error) {
        setMessage('Unable to load application.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      await api.put(`/applications/${id}`, formData)
      navigate('/applications')
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors)
          .flat()
          .join(' ')

        setMessage(errors)
      } else {
        setMessage('Unable to update application.')
      }
    }
  }

 
if (loading) {
  return <p>Loading application...</p>
}

return (
  <div className="edit-layout">
    <aside className="edit-sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">💼</span>
        <h2>JobTrack</h2>
      </div>

      <nav className="sidebar-menu">
        <Link to="/dashboard" className="sidebar-link">
          <span>📊</span> Dashboard
        </Link>

        <Link to="/applications" className="sidebar-link active">
          <span>📁</span> My Applications
        </Link>

        <Link to="/applications/create" className="sidebar-link">
          <span>➕</span> Add Application
        </Link>
      </nav>

      <div className="sidebar-promo">
        <div className="promo-illustration">🚀</div>
        <h3>Keep tracking your career journey!</h3>
      </div>
    </aside>

    <main className="edit-page">
      <header className="edit-header">
        <Link to="/applications" className="edit-back">
          ← Back to Applications
        </Link>

        <h1>Edit Application</h1>
        <p>Update your job application information.</p>
      </header>

      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="edit-field">
          <label>Company</label>
          <input
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="edit-field">
          <label>Position</label>
          <input
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            placeholder="Enter job position"
            required
          />
        </div>

        <div className="edit-field">
          <label>Location</label>
          <input
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </div>

        <div className="edit-field">
          <label>Application Date</label>
          <input
            type="date"
            name="application_date"
            value={formData.application_date || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-field">
          <label>Status</label>
          <select
            name="status"
            value={formData.status || 'pending'}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="edit-field">
          <label>Job URL</label>
          <input
            type="url"
            name="job_url"
            value={formData.job_url || ''}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="edit-field edit-notes">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            placeholder="Add your notes..."
          />
        </div>

        {message && <p className="edit-error">{message}</p>}

        <div className="edit-actions">
          <Link to="/applications" className="edit-cancel">
            Cancel
          </Link>

          <button type="submit" className="edit-save">
            💾 Save Changes
          </button>
        </div>
      </form>
    </main>
  </div>
)

}


export default EditApplication