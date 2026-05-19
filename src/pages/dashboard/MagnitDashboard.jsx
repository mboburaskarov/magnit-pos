import React, { useState } from 'react'
import { Calendar, DollarSign, ShoppingCart, Users, Clock, MapPin } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './magnit-dashboard.css'

const salesData = [
  { name: '04-11', value: 15 },
  { name: '04-12', value: 18 },
  { name: '04-13', value: 16 },
  { name: '04-14', value: 19 },
  { name: '04-15', value: 22 },
  { name: '04-16', value: 20 },
  { name: '04-17', value: 17 },
  { name: '04-18', value: 14 },
  { name: '04-19', value: 19 },
  { name: '04-20', value: 25 },
  { name: '04-21', value: 22 },
  { name: '04-22', value: 21 },
  { name: '04-23', value: 19 },
  { name: '04-24', value: 24 },
  { name: '04-25', value: 28 },
  { name: '04-26', value: 26 },
  { name: '04-27', value: 30 },
  { name: '04-28', value: 27 },
  { name: '04-29', value: 32 },
  { name: '04-30', value: 35 },
]

const pieData = [
  { name: 'Новый', value: 48, color: '#3B82F6' },
  { name: 'Принят', value: 31, color: '#8B5CF6' },
  { name: 'Готовится', value: 57, color: '#F59E0B' },
  { name: 'Курьер принял', value: 23, color: '#10B981' },
]

export default function MagnitDashboard() {
  const [chartType, setChartType] = useState('Sum')
  const [period, setPeriod] = useState('30d')

  return (
    <div className="mdash-container">
      <div className="mdash-header">
        <div>
          <h1 className="mdash-title">Дашборд</h1>
          <p className="mdash-subtitle">Обзор бизнес-показателей и операций</p>
        </div>
        <button className="mdash-btn-outline">
          <Calendar size={16} />
          Период отчета
        </button>
      </div>

      <div className="mdash-kpis">
        <div className="mdash-kpi-card mdash-kpi-purple">
          <div className="mdash-kpi-top">
            <div className="mdash-kpi-icon-wrap" style={{ color: '#8B5CF6' }}>
              <DollarSign size={18} />
            </div>
            <div className="mdash-kpi-badge mdash-badge-green">+8.7%</div>
          </div>
          <div className="mdash-kpi-val">487 650 000 <span className="mdash-kpi-unit">сум</span></div>
          <div className="mdash-kpi-label">Общая выручка</div>
        </div>

        <div className="mdash-kpi-card mdash-kpi-black">
          <div className="mdash-kpi-top">
            <div className="mdash-kpi-icon-wrap">
              <ShoppingCart size={18} />
            </div>
            <div className="mdash-kpi-badge mdash-badge-green">+12.4%</div>
          </div>
          <div className="mdash-kpi-val">3 842</div>
          <div className="mdash-kpi-label">Всего заказов</div>
        </div>

        <div className="mdash-kpi-card">
          <div className="mdash-kpi-top">
            <div className="mdash-kpi-icon-wrap" style={{ color: '#F59E0B', backgroundColor: '#FEF3C7' }}>
              <DollarSign size={18} />
            </div>
            <div className="mdash-kpi-badge mdash-badge-red">+2.1%</div>
          </div>
          <div className="mdash-kpi-val">126 900 <span className="mdash-kpi-unit">сум</span></div>
          <div className="mdash-kpi-label">Средний чек</div>
        </div>

        <div className="mdash-kpi-card">
          <div className="mdash-kpi-top">
            <div className="mdash-kpi-icon-wrap" style={{ color: '#374151', backgroundColor: '#F3F4F6' }}>
              <Users size={18} />
            </div>
            <div className="mdash-kpi-badge mdash-badge-green">+18.9%</div>
          </div>
          <div className="mdash-kpi-val">342</div>
          <div className="mdash-kpi-label">Новые клиенты</div>
        </div>

        <div className="mdash-kpi-card">
          <div className="mdash-kpi-top">
            <div className="mdash-kpi-icon-wrap" style={{ color: '#EF4444', backgroundColor: '#FEE2E2' }}>
              <Clock size={18} />
            </div>
            <div className="mdash-kpi-badge mdash-badge-red">+5.2%</div>
          </div>
          <div className="mdash-kpi-val">38 <span className="mdash-kpi-unit">мин</span></div>
          <div className="mdash-kpi-label">Ср. время доставки</div>
        </div>

        <div className="mdash-kpi-card">
          <div className="mdash-kpi-top">
            <div className="mdash-kpi-icon-wrap" style={{ color: '#8B5CF6', backgroundColor: '#EDE9FE' }}>
              <MapPin size={18} />
            </div>
            <div className="mdash-kpi-badge mdash-badge-green">+0.8%</div>
          </div>
          <div className="mdash-kpi-val">3.2 <span className="mdash-kpi-unit">км</span></div>
          <div className="mdash-kpi-label">Ср. расстояние</div>
        </div>
      </div>

      <div className="mdash-charts-row">
        <div className="mdash-chart-card mdash-sales-chart">
          <div className="mdash-chart-header">
            <div>
              <h3 className="mdash-chart-title">Отчет по продажам</h3>
              <p className="mdash-chart-subtitle">Динамика выручки и заказов</p>
            </div>
            <div className="mdash-chart-actions">
              <div className="mdash-toggle-group">
                {['1d', '7d', '30d', '6m', 'Max'].map(p => (
                  <button key={p} className={`mdash-toggle-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
                ))}
              </div>
              <div className="mdash-toggle-group">
                {['Sum', 'Qty'].map(p => (
                  <button key={p} className={`mdash-toggle-btn ${chartType === p ? 'active' : ''}`} onClick={() => setChartType(p)}>{p}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '280px', marginTop: '30px' }}>
            <ResponsiveContainer>
              <BarChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} tickFormatter={(val) => val + 'k'} />
                <Tooltip 
                  cursor={{ fill: '#F4F4F5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '12px 16px', fontWeight: 600 }}
                  formatter={(val) => [`${val} 000 000 сум`, 'Revenue']}
                />
                <Bar dataKey="value" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mdash-chart-card mdash-donut-chart">
          <div className="mdash-chart-header">
            <div>
              <h3 className="mdash-chart-title">Аналитические показатели</h3>
              <p className="mdash-chart-subtitle">Данные за текущий месяц</p>
            </div>
          </div>
          <div className="mdash-donut-wrap">
            <div style={{ width: '100%', height: '200px', position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mdash-donut-center">
                <div className="mdash-donut-val">3 842</div>
                <div className="mdash-donut-lbl">Orders</div>
              </div>
            </div>
            <div className="mdash-donut-legend">
              {pieData.map(item => (
                <div className="mdash-legend-item" key={item.name}>
                  <div className="mdash-legend-lbl">
                    <span className="mdash-dot" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </div>
                  <div className="mdash-legend-val">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mdash-tables-row">
        <div className="mdash-chart-card">
          <div className="mdash-chart-header">
            <h3 className="mdash-chart-title">Топ продуктов</h3>
          </div>
          <div className="mdash-table-empty">Нет данных для отображения</div>
        </div>
        <div className="mdash-chart-card">
          <div className="mdash-chart-header">
            <h3 className="mdash-chart-title">Топ категорий</h3>
          </div>
          <div className="mdash-table-empty">Нет данных для отображения</div>
        </div>
      </div>
    </div>
  )
}
