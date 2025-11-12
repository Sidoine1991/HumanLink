import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface MoodChartProps {
  type: 'pie' | 'bar';
  data?: any[];
  darkMode?: boolean;
}

const COLORS = {
  sad: '#3B82F6',
  anxious: '#6C5CE7',
  frustrated: '#EF4444',
  happy: '#FBBF24',
  calm: '#00B894',
  excited: '#EC4899',
};

const defaultPieData = [
  { name: 'Heureux', value: 35, color: COLORS.happy },
  { name: 'Calme', value: 25, color: COLORS.calm },
  { name: 'Excité', value: 20, color: COLORS.excited },
  { name: 'Anxieux', value: 10, color: COLORS.anxious },
  { name: 'Frustré', value: 7, color: COLORS.frustrated },
  { name: 'Triste', value: 3, color: COLORS.sad },
];

const defaultBarData = [
  { day: 'Lun', value: 3 },
  { day: 'Mar', value: 5 },
  { day: 'Mer', value: 2 },
  { day: 'Jeu', value: 4 },
  { day: 'Ven', value: 6 },
  { day: 'Sam', value: 4 },
  { day: 'Dim', value: 3 },
];

export default function MoodChart({ type, data, darkMode }: MoodChartProps) {
  if (type === 'pie') {
    const pieData = data || defaultPieData;
    
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Bar chart
  const barData = data || defaultBarData;
  
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={barData}>
        <XAxis 
          dataKey="day" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          hide 
        />
        <Bar 
          dataKey="value" 
          fill="#00B894" 
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
