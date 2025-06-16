import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Answer - 0.4 * 325 = 130
function RobotSpinoffQuestion2() {
  // Ratio 20:20:60 → Laser 20, Plasma 20, Defence 60 (out of total 100)
  const data = {
    labels: ['Laser', 'Plasma', 'Defence'],
    datasets: [
      {
        data: [20, 20, 60],
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: ({ label, raw }) => `${label}: ${raw}%`
        }
      },
    },
  };

  return (
    <div>
      <h2>Targeting System Online </h2>
      <ol>
        <li>Select your attack sequence.</li>
        <li>Use the total energy from Q1 (<strong>325 units</strong>).</li>
        <li>Split it according to the pie chart below (20% Laser, 20% Plasma, 60% Defence).</li>
        <li>Calculate the combined energy for <strong>attack</strong> (laser + plasma).</li>
      </ol>
      <p>Ready to fire? 🔥</p>
      <div style={{ width: '225px', height: '225px', margin: '0 auto' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default RobotSpinoffQuestion2;