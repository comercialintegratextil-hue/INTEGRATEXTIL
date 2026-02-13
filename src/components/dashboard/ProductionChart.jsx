import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
    return (
      <div className="p-3 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--bg-popover)', border: '1px solid var(--border)' }}>
        <p className="font-bold text-popover-foreground mb-1">{formattedDate}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--brand-indigo)' }}>{`Producción: ${payload[0].value} uds`}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--brand-orange)' }}>{`Eficiencia: ${payload[1].value}%`}</p>
      </div>
    );
  }
  return null;
};

const ProductionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true);
      try {
        const { data: chartData, error } = await supabase.rpc('get_weekly_performance');

        if (error) throw error;

        if (chartData) {
          const formattedData = chartData.map(item => ({
            ...item,
            day_name: new Date(item.log_date).toLocaleDateString('es-ES', { weekday: 'short' }),
            average_efficiency: Math.round(item.average_efficiency * 100),
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.warn("Modo Local/Offline: Usando datos de ejemplo para Gráfico de Producción");
        // Mock data for local development
        const mockData = [
          { log_date: '2023-10-23', total_units_produced: 120, average_efficiency: 0.85 },
          { log_date: '2023-10-24', total_units_produced: 145, average_efficiency: 0.88 },
          { log_date: '2023-10-25', total_units_produced: 132, average_efficiency: 0.82 },
          { log_date: '2023-10-26', total_units_produced: 156, average_efficiency: 0.90 },
          { log_date: '2023-10-27', total_units_produced: 168, average_efficiency: 0.92 },
          { log_date: '2023-10-28', total_units_produced: 95, average_efficiency: 0.78 },
        ];

        const formattedMockData = mockData.map(item => ({
          ...item,
          day_name: new Date(item.log_date).toLocaleDateString('es-ES', { weekday: 'short' }),
          average_efficiency: Math.round(item.average_efficiency * 100),
        }));
        setData(formattedMockData);
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklyData();
  }, []);

  if (loading) {
    return (
      <div className="h-[350px] flex justify-center items-center p-6 rounded-xl card-shadow" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-xl card-shadow h-[350px]"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Rendimiento de Producción Semanal
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--brand-indigo)" stopOpacity={0.9} />
              <stop offset="95%" stopColor="var(--brand-indigo)" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--brand-orange)" stopOpacity={0.9} />
              <stop offset="95%" stopColor="var(--brand-orange)" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis
            dataKey="day_name"
            tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="var(--brand-indigo)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Unidades', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', style: { textAnchor: 'middle' } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--brand-orange)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Eficiencia (%)', angle: 90, position: 'insideRight', fill: 'var(--text-secondary)', style: { textAnchor: 'middle' } }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.4 }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
          <Bar
            yAxisId="left"
            dataKey="total_units_produced"
            name="Producción (uds)"
            fill="url(#colorProduction)"
            barSize={40}
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="average_efficiency"
            name="Eficiencia"
            stroke="var(--brand-orange)"
            strokeWidth={3}
            dot={{ r: 4, stroke: 'var(--brand-orange)', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
            activeDot={{ r: 7, stroke: 'var(--brand-orange)', strokeWidth: 2, fill: 'var(--brand-orange)' }}
            animationDuration={2000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProductionChart;