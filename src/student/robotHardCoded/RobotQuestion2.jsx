import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../robotHardCoded/RobotQuestion1.css'; // Reuse the same CSS

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

function RobotQuestion2({ isTeacherMode = false }) {
  const [answer, setAnswer] = useState(['', '']);

  const handleChange = (index, value) => {
    // Only allow single digit numbers (0-9)
    if (value === '' || /^[0-9]$/.test(value)) {
      const newAnswer = [...answer];
      newAnswer[index] = value;
      setAnswer(newAnswer);
      
      console.log("Input changed:", index, value, newAnswer);
      localStorage.setItem('robotAnswer', newAnswer.join(''));
    }
  };

  // Ratio 20:40:40 → Laser 20, Plasma 40, Defence 40 (out of total 100)
  const data = {
    labels: ['Laser', 'Plasma', 'Defence'],
    datasets: [
      {
        data: [20, 40, 40],
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
    <div style={{ 
      minHeight: '-50vh', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'url(/public/robot-bg.svg) center/cover no-repeat',
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Circuit contrails - bottom right */}
      {!isTeacherMode && (
        <div style={{
          position: 'absolute',
          bottom: -250,
          left: -240,
          zIndex: 0,
        }}>
          <img src="/contrails up.png" alt="Circuit contrails up" style={{ maxHeight: '40vh' }} />
        </div>
      )}

    <div>
      <h2>Calculate Attack Energy</h2>
      <ol style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '-2rem' }}>
        <li>The pie chart below shows the energy available for each function. The total energy from Q1 is 125.</li>
        <li>Calculate the total energy available for an attack (laser + plasma)!</li>
      </ol>
      <div style={{ width: '325px', height: '325px', margin: '0.5rem auto 0' }}>
        <Pie data={data} options={{
          ...options,
          plugins: {
            ...options.plugins,
            legend: {
              position: 'right',
              labels: {
                color: '#FFFFFF', // Gold color for the legend text
                font: {
                  size: 14,
                  weight: 'light'
                },
                padding: 20 // Add padding between chart and legend
              }
            },
            datalabels: {
              color: '#fff',
              font: {
                weight: 'bold',
                size: 18
              },
              formatter: (value) => `${value}%`
            }
          }
        }} />
      </div>
      
      {/* Answer input section - similar to RobotQuestion1 */}
      <div className="number-input-container" style={{ marginTop: '-5px' }}>
        <div className="number-inputs">
          {[0, 1].map((index) => (
            <input
              key={index}
              type="text"
              value={answer[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              className="number-input"
              maxLength="2"
              placeholder="#"
              style={{position: 'relative', zIndex: 50}}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default RobotQuestion2;