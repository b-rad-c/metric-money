import React from 'react';
import { generator } from './StreamingSimulator';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  aspectRatio: 1,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};



function StreamingChart(props) {

  const simulatorConfig = {
    inPerSec: props.inPerSec,
    outPerSec: props.outPerSec,
    startDate: new Date('Jan 01, 2021'),
    startBalance: 0
  }

  const sample = generator(simulatorConfig)

  const data = {
    labels: sample.labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: sample.data,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 0
      }
    ],
  };


  return (<Line options={chartOptions} data={data} />);
}

export { StreamingChart }