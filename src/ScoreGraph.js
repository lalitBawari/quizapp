import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register the necessary components and scales
Chart.register(CategoryScale, LinearScale, BarElement, Title);

const ScoreGraph = ({ score, totalQuestions }) => {
  const correctColor = 'rgba(244, 67, 54, 0.6)';
  const incorrectColor = 'rgba(76, 175, 80, 0.6)';
  

  const data = {
    labels: ['Score'],
    datasets: [
      {
        label: 'Score',
        data: [score],
        backgroundColor: score === totalQuestions ? correctColor : incorrectColor,
      },
      {
        label: 'Total Questions',
        data: [totalQuestions - score],
        backgroundColor: score === totalQuestions ? incorrectColor : correctColor,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: totalQuestions,
      },
    },
  };

  return (
    <div>
      <h2>Score Graph</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ScoreGraph;
