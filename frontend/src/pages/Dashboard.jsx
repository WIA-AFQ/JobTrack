
import { useState, useEffect } from 'react'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  })

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats')
        setStats(response.data)
      } catch (error) {
        setMessage('Unable to load dashboard statistics.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.log('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: '📁',
      color: 'blue',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: '⏳',
      color: 'orange',
    },
    {
      title: 'Interviews',
      value: stats.interview,
      icon: '💬',
      color: 'purple',
    },
    {
      title: 'Accepted',
      value: stats.accepted,
      icon: '✓',
      color: 'green',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: '✕',
      color: 'red',
    },
  ]

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          JobTrack<span>.</span>
        </div>

        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav">

          <Link to="/dashboard" className="sidebar-link active">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/applications" className="sidebar-link">
            <span>📋</span>
            My Applications
          </Link>

          <Link to="/applications/create" className="sidebar-link">
            <span>＋</span>
            Add Application
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <button onClick={handleLogout} className="logout-button">
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's an overview of your job search.</p>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">U</div>
            <span>My Account</span>
          </div>
        </header>

        {/* WELCOME SECTION */}
        <section className="welcome-card">
          <div>
            <h2>Welcome to JobTrack! 👋</h2>
            <p>
              Keep track of your applications and stay organized
              throughout your career journey.
            </p>

            <Link to="/applications/create" className="welcome-button">
              + Add New Application
            </Link>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="statistics-section">

          <div className="section-heading">
            <div>
              <h2>Application Overview</h2>
              <p>Track the progress of your applications.</p>
            </div>
          </div>

          {loading ? (
            <p className="dashboard-loading">Loading statistics...</p>
          ) : (
            <div className="stats-grid">

              {statCards.map((card) => (
                <div className="stat-card" key={card.title}>

                  <div className={`stat-icon ${card.color}`}>
                    {card.icon}
                  </div>

                  <p>{card.title}</p>

                  <h3>{card.value}</h3>

                </div>
              ))}

            </div>
          )}

          {message && (
            <p className="dashboard-error">{message}</p>
          )}

        </section>

        {/* QUICK ACTIONS */}
        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="actions-grid">

            <Link to="/applications/create" className="action-card">
              <span className="action-icon">＋</span>
              <div>
                <h3>Add Application</h3>
                <p>Record a new job opportunity.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/applications" className="action-card">
              <span className="action-icon">📋</span>
              <div>
                <h3>View Applications</h3>
                <p>Manage all your job applications.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

          </div>

        </section>

      </main>
    </div>
  )
}

export default Dashboard
