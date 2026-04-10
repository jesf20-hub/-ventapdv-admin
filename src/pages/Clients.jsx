import { useState, useEffect } from 'react'
import { api } from '../utils/api'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })

  useEffect(() => { loadClients() }, [])

  const loadClients = async () => {
    try {
      const data = await api.getClients()
      setClients(data)
    } catch (err) { console.error(err) }
  }

  const save = async () => {
    try {
      if (edit) {
        await api.updateClient(edit.id, form)
      } else {
        await api.addClient(form)
      }
      setShowModal(false)
      setEdit(null)
      setForm({ name: '', phone: '', email: '', address: '' })
      loadClients()
    } catch (err) { alert('Error: ' + err.message) }
  }

  const remove = async (id) => {
    if (confirm('¿Eliminar?')) {
      await api.deleteClient(id)
      loadClients()
    }
  }

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>👥 Clientes</h1>
        <button className="btn btn-primary" onClick={() => { setEdit(null); setForm({ name: '', phone: '', email: '', address: '' }); setShowModal(true) }}>
          + Nuevo Cliente
        </button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>
                <td className="actions-cell">
                  <button className="btn btn-small" onClick={() => { setEdit(c); setForm(c); setShowModal(true) }}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => remove(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{edit ? 'Editar' : 'Nuevo'} Cliente</h3>
            <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input placeholder="Dirección" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
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