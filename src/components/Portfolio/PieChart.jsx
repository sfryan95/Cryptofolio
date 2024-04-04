import React, { useEffect, useState } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const colors = ['#031E43', '#b51963', ' #3856f7', '#184D06', '#801eab', '#BF360C', '#004D40', '#550621', '#125866', '#256538', '#A03418', '#52597C', '#471084', '#CC1136', '#085F46'];

const sizing = {
  margin: { right: 5 },
  width: 300,
  height: 300,
  legend: { hidden: true },
};

export default function PieChartWithCustomizedLabel({ rows }) {
  const [chartState, setChartState] = useState({ data: [], total: 0 });

  useEffect(() => {
    const newChartData = rows.map((row, index) => ({
      label: row.symbol || 'Unknown', // Provide a default label if undefined
      value: row.value || 0, // Provide a default value if undefined
      color: colors[index % colors.length],
    }));
    const newTotal = newChartData.reduce((a, b) => a + b.value, 0);
    setChartState({ data: newChartData, total: newTotal });
  }, [rows]);

  const getArcLabel = (params) => {
    if (chartState.total === 0) {
      return '';
    }
    const percent = params.value / chartState.total;
    if (percent * 100 >= 3) {
      return `${(percent * 100).toFixed(0)}%`;
    }
  };

  return (
    <PieChart
      series={[
        {
          outerRadius: 150,
          data: chartState.data,
          arcLabel: getArcLabel,
          arcLabelRadius: 110,
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
