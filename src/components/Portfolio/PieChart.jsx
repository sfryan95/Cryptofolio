import React, { useEffect, useState } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const colors = ['#355472', '#3856f7', '#801eab'];

const sizing = {
  margin: { right: 5 },
  width: 250,
  height: 250,
  legend: { hidden: true },
};

export default function PieChartWithCustomizedLabel({ rows }) {
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newChartData = rows.map((row, index) => ({
      label: row.symbol || 'Unknown', // Provide a default label if undefined
      value: row.value || 0, // Provide a default value if undefined
      color: colors[index % colors.length],
    }));
    setChartData(newChartData);
    const newTotal = newChartData.map((item) => item.value).reduce((a, b) => a + b, 0);
    setTotal(newTotal);
  }, [rows]);

  const getArcLabel = (params) => {
    const percent = params.value / total;
    if (percent * 100 >= 5) {
      return `${(percent * 100).toFixed(0)}%`;
    }
  };

  return (
    <PieChart
      series={[
        {
          outerRadius: 100,
          data: chartData,
          arcLabel: getArcLabel,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontSize: 14,
          fontWeight: 'bold',
        },
      }}
      {...sizing}
    />
  );
}
