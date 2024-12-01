import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDashboard = ({ tasks }) => {
  const taskStatusCounts = useMemo(() => {
    const counts = { 'To Do': 0, 'In Progress': 0, 'Completed': 0 };
    tasks.forEach(task => {
      if (counts[task.status] !== undefined) {
        counts[task.status] += 1;
      }
    });
    return counts;
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedPercentage = ((taskStatusCounts['Completed'] / totalTasks) * 100).toFixed(0);
  const inProgressPercentage = ((taskStatusCounts['In Progress'] / totalTasks) * 100).toFixed(0);
  const toDoPercentage = ((taskStatusCounts['To Do'] / totalTasks) * 100).toFixed(0);

  let motivationalMessage = '';
  if (completedPercentage >= 50) {
    motivationalMessage = "🎉 Awesome job! Keep up the great work!";
  } else if (inProgressPercentage >= 50) {
    motivationalMessage = "💪 You're on track! Stay focused and keep pushing!";
  } else if (toDoPercentage >= 50) {
    motivationalMessage = "🚀 You've got this! Let's tackle those tasks!";
  } else {
    motivationalMessage = "⚖️ Balanced progress! Keep moving forward!";
  }

  const chartData = {
    labels: Object.keys(taskStatusCounts),
    datasets: [
      {
        label: 'Task Status Distribution',
        data: Object.values(taskStatusCounts),
        backgroundColor: ['#00FF00', '#00FFFF', '#FF00FF'], 
        borderColor: '#000000', 
        borderWidth: 2,
        hoverBorderColor: ['#00FF00', '#00FFFF', '#FF00FF'], 
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#FFFFFF', 
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: '#000000', 
        textAlign: 'center',
        boxShadow: '0px 0px 15px rgba(0, 255, 255, 0.3)', 
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: '#FFFFFF', 
          fontWeight: 'bold',
          fontSize: 24,
          textShadow: '0px 0px 10px #00FFFF, 0px 0px 20px #00FFFF', 
        }}
      >
        Task Status Dashboard
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 2,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#00FF00', 
          textShadow: '0px 0px 5px #00FF00', 
        }}
      >
        {motivationalMessage}
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxWidth: 300,
          height: 300,
          margin: '0 auto',
          filter: 'drop-shadow(0px 0px 15px rgba(0, 255, 255, 0.6))', 
        }}
      >
        <Pie data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default TaskDashboard;
