import React from 'react';
import 'react-json-pretty/themes/monikai.css';
//import { useState } from 'react';
import { generator } from './PayCycleSimulator';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine  
} from 'recharts';

const payCycleData = generator(new Date('Jan 01, 2021'), 1000, 1000, 180)
console.log(payCycleData)

function PayCyclePage() {
  const chartWidth = 1300
  return (
  <div>

    <div style={{"width": "100%", "margin": "0 auto"}}>
      <LineChart width={chartWidth} height={400} data={payCycleData.balanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="balance" stroke="#8884d8" />
        <XAxis dataKey="label" ticks={payCycleData.months} />
        <YAxis />
        <Tooltip />
        { // pay check reference lines
          payCycleData.payChecks.map((payDate, index) => (
            <ReferenceLine key={index} x={payDate} stroke="green" strokeDasharray="0" strokeWidth="3" />
          ))
        }

        { // start of month reference lines
          payCycleData.months.map((month, index) => (
            <ReferenceLine key={index} x={month} stroke="red" strokeDasharray="0" strokeWidth="3" />
          ))
        }
        
      </LineChart>
    </div>
    
  </div>
  );
}

export default PayCyclePage