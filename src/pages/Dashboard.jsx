import { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { api } from '../utils/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, clients: 0, sales: 0, totalSales: 0 })
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await api.syncAll()
      const sales = data.sales || []
      const total = sales.reduce((acc, s) => acc + parseFloat(s.total || 0), 0)
      
      setStats({
        products: (data.products || []).length,
        clients: (data.clients || []).length,
        sales: sales.length,
        totalSales: total
      })

      // Chart data - last 7 days
      const days = []
      const values = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayStr = date.toDateString()
        const daySales = sales.filter(s => new Date(s.date).toDateString() === dayStr)
        days.push(date.toLocaleDateString('es', { weekday: 'short' }))
        values.push(daySales.reduce((acc, s) => acc + parseFloat(s.total || 0), 0))
      }

      setChartData({
        labels: days,
        datasets: [{
          label: 'Ventas ($)',
          data: values,
          backgroundColor: '#4f46e5'
        }]
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '25px' }}>📊 Dashboard</h1>
      
      <div className="grid-4">
        <div className="card stat-card">
          <p>Productos</p>
          <div className="stat-value">{stats.products}</div>
        </div>
        <div className="card stat-card">
          <p>Clientes</p>
          <div className="stat-value">{stats.clients}</div>
        </div>
        <div className="card stat-card">
          <p>Ventas</p>
          <div className="stat-value">{stats.sales}</div>
        </div>
        <div className="card stat-card">
          <p>Total</p>
          <div className="stat-value">${stats.totalSales.toFixed(2)}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Ventas de los últimos 7 días</h3>
        <div style={{ height: '300px' }}>
          {chartData && <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
        </div>
      </div>
    </div>
  )
}