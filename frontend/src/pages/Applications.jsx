
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Applications.css'

function Applications() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      setMessage('')

      try {
        const response = await api.get('/applications', {
          params: {
            ...(search && { search }),
            ...(status && { status }),
          },
        })

        setApplications(response.data.data)
      } catch (error) {
        setMessage('Unable to load applications.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [search, status])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this application?'
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/applications/${id}`)

      setApplications((prev) =>
        prev.filter((application) => application.id !== id)
      )
    } catch (error) {
      setMessage('Unable to delete application.')
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
    <div className="applications-layout">

      {/* SIDEBAR */}
      <aside className="applications-sidebar">

        <div className="sidebar-logo">
          <span className="logo-icon">💼</span>
          <h2>JobTrack</h2>
        </div>

        <nav className="sidebar-menu">
          <Link to="/dashboard" className="sidebar-link">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/applications" className="sidebar-link active">
            <span>▤</span>
            My Applications
          </Link>

          <Link to="/applications/create" className="sidebar-link">
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
          <h3>Track your career with confidence!</h3>
          <p>Stay organized and reach your career goals.</p>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="applications-page">

        <header className="applications-header">
          <div>
            <Link to="/dashboard" className="back-link">
              ← Back to Dashboard
            </Link>

            <h1>My Applications</h1>
            <p>Manage and track all your job applications.</p>
          </div>

          <Link
            to="/applications/create"
            className="add-application-button"
          >
            + Add New Application
          </Link>
        </header>

        <section className="applications-content">

          <div className="applications-toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search company or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-filter"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p className="applications-message">
              Loading applications...
            </p>
          ) : applications.length === 0 ? (
            <div className="empty-applications">
              <div className="empty-icon">📂</div>
              <h2>No applications found</h2>
              <p>
                Start tracking your job search by adding an application.
              </p>
              <Link
                to="/applications/create"
                className="add-application-button"
              >
                + Add Application
              </Link>
            </div>
          ) : (
            <div className="applications-grid">
              {applications.map((application) => (
                <article
                  className="application-card"
                  key={application.id}
                >

                  <div className="application-card-top">
                    <div className="company-icon">
                      {application.company?.charAt(0).toUpperCase()}
                    </div>

                    <span className={`status-badge ${application.status}`}>
                      {application.status}
                    </span>
                  </div>

                  <h2>{application.company}</h2>

                  <p className="application-position">
                    {application.position}
                  </p>

                  <div className="application-details">
                    <p>
                      📍 {application.location || 'Location not specified'}
                    </p>
                    <p>📅 {application.application_date}</p>
                  </div>

                  <p className="application-notes">
                    {application.notes || 'No notes added.'}
                  </p>

                  <div className="application-actions">
                    <Link
                      to={`/applications/${application.id}/edit`}
                      className="edit-button"
                    >
                      ✎ Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(application.id)}
                      className="delete-button"
                    >
                      🗑 Delete
                    </button>
                  </div>

                </article>
              ))}
            </div>
          )}

          {message && (
            <p className="applications-error">{message}</p>
          )}

        </section>
      </main>
    </div>
  )
}

export default Applications
