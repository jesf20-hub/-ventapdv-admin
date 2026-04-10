import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import * as XLSX from 'xlsx'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadSales() }, [])

  const loadSales = async () => {
    try {
      const data = await api.getSales()
      setSales(data)
    } catch (err) { console.error(err) }
  }

  const exportExcel = () => {
    const data = sales.map(s => ({
      ID: s.id,
      Fecha: new Date(s.date).toLocaleString(),
      Total: s.total,
      Items: Array.isArray(s.items) ? s.items.length : 0,
      'Items Detail': Array.isArray(s.items) ? s.items.map(i => `${i.name} x${i.quantity}`).join(', ') : ''
    }))
    
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas')
    XLSX.writeFile(wb, `ventas_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const getFilteredSales = () => {
    const now = new Date()
    if (filter === 'today') {
      return sales.filter(s => new Date(s.date).toDateString() === now.toDateString())
    }
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return sales.filter(s => new Date(s.date) >= weekAgo)
    }
    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return sales.filter(s => new Date(s.date) >= monthAgo)
    }
    return sales
  }

  const filteredSales = getFilteredSales()
  const total = filteredSales.reduce((acc, s) => acc + parseFloat(s.total || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>💰 Ventas</h1>
        <button className="btn btn-success" onClick={exportExcel}>📥 Exportar Excel</button>
      </div>

      <div className="tab-buttons">
        <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todas</button>
        <button className={`tab-btn ${filter === 'today' ? 'active' : ''}`} onClick={() => setFilter('today')}>Hoy</button>
        <button className={`tab-btn ${filter === 'week' ? 'active' : ''}`} onClick={() => setFilter('week')}>Esta Semana</button>
        <button className={`tab-btn ${filter === 'month' ? 'active' : ''}`} onClick={() => setFilter('month')}>Este Mes</button>
      </div>

      <div className="grid-4" style={{ marginBottom: '20px' }}>
        <div className="card stat-card">
          <p>Ventas</p>
          <div className="stat-value">{filteredSales.length}</div>
        </div>
        <div className="card stat-card">
          <p>Total</p>
          <div className="stat-value">${total.toFixed(2)}</div>
        </div>
        <div className="card stat-card">
          <p>Promedio</p>
          <div className="stat-value">${filteredSales.length ? (total / filteredSales.length).toFixed(2) : 0}</div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.slice(0, 50).map(s => (
              <tr key={s.id}>
                <td>#{s.id}</td>
                <td>{new Date(s.date).toLocaleString()}</td>
                <td>{Array.isArray(s.items) ? s.items.length : 0}</td>
                <td style={{ fontWeight: 'bold' }}>${parseFloat(s.total).toFixed(2)}</td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {Array.isArray(s.items) ? s.items.map(i => `${i.name} x${i.quantity}`).join(', ') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}