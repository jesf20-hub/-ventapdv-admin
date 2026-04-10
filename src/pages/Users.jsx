import { useState, useEffect } from 'react'

const API_URL = 'https://ventapdv-api-production.up.railway.app'

export default function Users() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'user' })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('adminUsers') || '[]')
    if (stored.length === 0) {
      const defaultUsers = [
        { id: 1, username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
        { id: 2, username: 'user1', password: 'user123', name: 'Usuario 1', role: 'user' }
      ]
      localStorage.setItem('adminUsers', JSON.stringify(defaultUsers))
      setUsers(defaultUsers)
    } else {
      setUsers(stored)
    }
  }, [])

  const save = () => {
    let updated
    if (edit) {
      updated = users.map(u => u.id === edit.id ? { ...form, id: edit.id } : u)
    } else {
      updated = [...users, { ...form, id: Date.now() }]
    }
    setUsers(updated)
    localStorage.setItem('adminUsers', JSON.stringify(updated))
    setShowModal(false)
    setEdit(null)
    setForm({ username: '', password: '', name: '', role: 'user' })
  }

  const remove = (id) => {
    if (confirm('¿Eliminar usuario?')) {
      const updated = users.filter(u => u.id !== id)
      setUsers(updated)
      localStorage.setItem('adminUsers', JSON.stringify(updated))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>👤 Usuarios</h1>
        <button className="btn btn-primary" onClick={() => { setEdit(null); setForm({ username: '', password: '', name: '', role: 'user' }); setShowModal(true) }}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.name}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-success'}`}>
                    {u.role === 'admin' ? 'Admin' : 'Usuario'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn btn-small" onClick={() => { setEdit(u); setForm(u); setShowModal(true) }}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => remove(u.id)} disabled={u.role === 'admin'}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>🔐 Agregar usuario a la API</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
          Los usuarios se guardan localmente. Para login en la app, usa admin/admin123.
        </p>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{edit ? 'Editar' : 'Nuevo'} Usuario</h3>
            <input placeholder="Usuario" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}