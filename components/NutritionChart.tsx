
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { NutrientInfo } from '../types';

interface Props {
  data: NutrientInfo;
}

const NutritionChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.protein * 4, color: '#10b981' },
    { name: 'Karbohidrat', value: data.carbs * 4, color: '#3b82f6' },
    { name: 'Lemak', value: data.fat * 9, color: '#f59e0b' },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} kcal`, 'Energi']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 text-xs font-medium text-slate-600 -mt-8">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" /> Protein
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" /> Karbo
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" /> Lemak
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;
