import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- Simulate Weekly Data ---
// In a real app, this data would come from context/API based on historical records.
// We'll simulate points for a few common practices.
const practiceNames = ['Cold Shower', 'Outdoor Walking', 'Gratitude Journal', 'Focus Breathing']; // Example practices

const generateRandomPoints = () => Math.floor(Math.random() * 6); // 0-5 points

const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
  const dayData: { day: string; [key: string]: number | string } = { day };
  practiceNames.forEach(name => {
    // Randomly decide if the practice was done and assign points
    if (Math.random() > 0.3) { // 70% chance of doing the practice
      dayData[name] = generateRandomPoints();
    } else {
      dayData[name] = 0;
    }
  });
  return dayData;
});

// Define colors for the stacks (similar to FocusTimer)
const COLORS = ['#148BAF', '#04C4D5', '#53FCFF', '#87CEEB']; // Add more if needed

const WeeklyPointsChart: React.FC = () => {
  return (
    <div className="bg-[#53FCFF1A] rounded-lg flex flex-col items-center gap-5 p-5 w-full mt-6 max-w-4xl mx-auto">
      <div className="text-[#148BAF] font-happy-monkey text-base lowercase w-full text-center">
        YOUR WEEKLY POINTS
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(73, 218, 234, 0.2)" />
            <XAxis dataKey="day" stroke="#148BAF" fontSize={14} />
            <YAxis stroke="#148BAF" fontSize={14} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(247, 255, 255, 0.9)',
                borderColor: '#49DADD',
                fontFamily: 'Happy Monkey, cursive',
                fontSize: '14px',
                borderRadius: '4px',
              }}
              labelStyle={{ color: '#148BAF', fontWeight: 'bold' }}
              itemStyle={{ color: '#148BAF' }}
              formatter={(value: number, name: string) => [`${value} pts`, name]}
            />
            <Legend wrapperStyle={{ fontFamily: 'Righteous, cursive', fontSize: '12px' }} />
            {practiceNames.map((name, index) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="a" // All bars with the same stackId will be stacked
                fill={COLORS[index % COLORS.length]} // Cycle through colors
                name={name} // Name shown in legend and tooltip
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyPointsChart;
