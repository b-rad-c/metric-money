import React from 'react';
import { render } from "react-dom";
import './index.scss';
import MetricMoney from "./components/MetricMoney.js";

const rootElement = document.getElementById("root");
render(
  <MetricMoney />,
  rootElement
);