import React from 'react';
import { render } from "react-dom";
import './index.scss';
import MetricMoneyChart from './components/Chart.js'

function MetricMoney() {

  return (
    <div className="text-center">
      <h1>Metric Money</h1>
      <MetricMoneyChart />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(
  <MetricMoney />,
  rootElement
);