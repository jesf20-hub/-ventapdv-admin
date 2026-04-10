import { useState, useEffect } from 'react'
import { api } from '../utils/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: '' })

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      const data = await api.getProducts()
      setProducts(data)
    } catch (err) { console.error(err) }
  }

  const save = async () => {
    try {
      if (edit) {
        await api.updateProduct(edit.id, form)
      } else {
        await api.addProduct(form)
      }
      setShowModal(false)
      setEdit(null)
      setForm({ name: '', price: '', stock: '', category: '' })
      loadProducts()
    } catch (err) { alert('Error: ' + err.message) }
  }

  const remove = async (id) => {
    if (confirm('¿Eliminar?')) {
      await api.deleteProduct(id)
      loadProducts()
    }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📦 Productos</h1>
        <button className="btn btn-primary" onClick={() => { setEdit(null); setForm({ name: '', price: '', stock: '', category: '' }); setShowModal(true) }}>
          + Nuevo Producto
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
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${parseFloat(p.price).toFixed(2)}</td>
                <td>
                  <span className={`badge ${p.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn btn-small" onClick={() => { setEdit(p); setForm(p); setShowModal(true) }}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => remove(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{edit ? 'Editar' : 'Nuevo'} Producto</h3>
            <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Categoría" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            <input type="number" placeholder="Precio" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
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