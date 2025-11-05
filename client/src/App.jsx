import { useState, useEffect } from 'react'
import './App.css'

// Configuración de la API usando variables de entorno
const API_URL = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_BASE}`

function App() {
  const [users, setUsers] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  })

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers()
  }, [])

  // GET - Obtener todos los usuarios
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      console.log(data.data);
      
      setUsers(data.data)
    } catch (err) {
      setError(`Error al cargar usuarios: ${err.message}`)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  // POST - Crear nuevo usuario
  const createUser = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      const newUser = result.data || result
      setUsers([...users, newUser])
      return newUser
    } catch (err) {
      setError(`Error al crear usuario: ${err.message}`)
      console.error('Error creating user:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // PUT - Actualizar usuario existente
  const updateUser = async (id, userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const result = await response.json()
      const updatedUser = result.data || result
      setUsers(users.map(user => user.id === id ? updatedUser : user))
      return updatedUser
    } catch (err) {
      setError(`Error al actualizar usuario: ${err.message}`)
      console.error('Error updating user:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // DELETE - Eliminar usuario
  const deleteUser = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      setError(`Error al eliminar usuario: ${err.message}`)
      console.error('Error deleting user:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingUser) {
        // Editar usuario existente
        await updateUser(editingUser.id, formData)
      } else {
        // Crear nuevo usuario
        await createUser(formData)
      }
      resetForm()
    } catch (err) {
      // El error ya se maneja en las funciones individuales
      console.error('Error al enviar formulario:', err)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(id)
      } catch (err) {
        // El error ya se maneja en la función deleteUser
        console.error('Error al eliminar usuario:', err)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: ''
    })
    setEditingUser(null)
    setIsFormOpen(false)
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn btn-primary" onClick={openCreateForm} disabled={loading}>
          + Nuevo Usuario
        </button>
      </header>

      {error && (
        <div className="error-message" style={{
          background: '#fee',
          color: '#c33',
          padding: '12px',
          borderRadius: '4px',
          margin: '10px 0',
          border: '1px solid #fcc'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              float: 'right',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#c33'
            }}
          >
            &times;
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-indicator" style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666'
        }}>
          Cargando...
        </div>
      )}

      {isFormOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="btn-close" onClick={resetForm}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="fullName">Nombre Completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese nombre completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-list">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No hay usuarios registrados</p>
            <p className="empty-state-hint">Haz clic en "Nuevo Usuario" para comenzar</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
