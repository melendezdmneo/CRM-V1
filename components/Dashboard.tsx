import React from 'react';
import { Deal, PipelineStats, Stage } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface DashboardProps {
  deals: Deal[];
  stats: PipelineStats;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC<DashboardProps> = ({ deals, stats }) => {
  
  // Prepare data for Bar Chart (Value by Stage)
  const dealsByStage = Object.values(Stage).map(stage => {
      const value = deals.filter(d => d.stage === stage).reduce((acc, d) => acc + d.value, 0);
      return { name: stage.split(' ')[0], fullName: stage, value };
  });

  // Prepare data for Pie Chart (Deals by Service Type)
  const dealsByTypeMap = deals.reduce((acc, deal) => {
      acc[deal.serviceType] = (acc[deal.serviceType] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const dealsByType = Object.keys(dealsByTypeMap).map(key => ({
      name: key,
      value: dealsByTypeMap[key]
  }));

  return (
    <div className="p-6 overflow-y-auto h-full space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-slate-500 font-medium mb-1">Pipeline Total</p>
          <h3 className="text-2xl font-bold text-slate-800">
             ${stats.totalValue.toLocaleString()}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-slate-500 font-medium mb-1">Tasa de Cierre (Win Rate)</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {stats.winRate.toFixed(1)}%
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-slate-500 font-medium mb-1">Ticket Promedio</p>
          <h3 className="text-2xl font-bold text-blue-600">
            ${stats.avgDealValue.toLocaleString()}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-slate-500 font-medium mb-1">Deals Activos</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {deals.length}
          </h3>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Valor de Pipeline por Etapa</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealsByStage}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Distribución por Tipo de Servicio</h4>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dealsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dealsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;