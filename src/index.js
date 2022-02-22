import React from 'react';
import { render } from "react-dom";
import './index.scss';
import MetricMoneyChart from './components/Chart.js'

function MetricMoney() {

  return (
    <div className="app position-absolute top-0 start-0 text-center bg-primary bg-gradient">
      <MetricMoneyChart />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(
  <MetricMoney />,
  rootElement
);