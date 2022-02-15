import React, { useState, useMemo } from 'react';
import { Stack } from 'react-bootstrap';
import { Bill, BillList, generator } from './PayCycleSimulator';
import { StartDateInput, SalaryInput, BillsInput } from './PayCheckInputs'
import { add } from 'date-fns'
import { stackGap } from '../../index';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,  
  ReferenceArea
} from 'recharts';

const dateTickFormatter = (label, index) => { return (label.startsWith('Jan') || index === 0) ? label : label.substring(0, label.length - 6) }

function PayCyclePage() {

  // chart config
  const chartWidth = 2000
  const chartMargin = { top: 5, right: 20, bottom: 5, left: 0 }

  //
  // state variables and handlers
  //

  const [startDate, setStartDate] = useState(new Date('Jan 01, 2021'));
  const startDateHandler = (offset) => { setStartDate(add(startDate, offset)) }

  const [salary, setSalary] = useState(42000);
  const salaryHandler = (num) => { setSalary(salary + num) }
  const payCheckAmount = useMemo(() => { return salary / 26 }, [salary])

  const [startBalance, setStartBalance] = useState(1000);
  const startBalanceHandler = (num) => { setStartBalance(startBalance + num) }

  const [showPayCheckLines, setShowPayCheckLines] = useState(true);
  const showPayCheckLinesHandler = (e) => { setShowPayCheckLines(e.target.checked) }

  // bill inputs
  const [housingCost, setHousingCost] = useState(1000);
  const housingCostHandler = (num) => { setHousingCost(housingCost + num) }


  //
  // generate chart data
  //

  const bills = useMemo(() => {

    return new BillList([
      new Bill('HOUSING', housingCost, 1)
    ])

  }, [housingCost])

  const chartData = useMemo(() => {
    const payCycleData = generator(startDate, startBalance, payCheckAmount, bills, 375)
    console.log(payCycleData)
    return payCycleData
  }, [startDate, startBalance, payCheckAmount, bills]);

  return (
  <div style={{textAlign: "left"}}>
    {
      /* line chart */
    }

    <LineChart width={chartWidth} height={400} data={chartData.balanceData} margin={chartMargin}>
      <XAxis dataKey="label" ticks={chartData.months} tickFormatter={dateTickFormatter} interval="preserveStart" />
      <YAxis />
      <Tooltip />
      { // alternating background for each month
        chartData.bkgdIntervals.map((bkgdInt, index) => (
          <ReferenceArea key={'bkgd-' + index} x1={bkgdInt[0]} x2={bkgdInt[1]} stroke="none" strokeOpacity={0.3} />
        ))
      }

      { // pay check reference lines
        showPayCheckLines && chartData.payChecks.map((payDate, index) => (
          <ReferenceLine key={index} x={payDate} stroke="green" strokeDasharray="0" strokeWidth={2} />
        ))
      }
      
      <Line type="stepAfter" dataKey="balance" stroke="black" strokeWidth={3} dot={false} isAnimationActive={false}/>

    </LineChart>

    {
      /* inputs */
    }

    <Stack direction="horizontal" gap={stackGap}>
      <StartDateInput 
        startDateHandler={startDateHandler} 
        startDate={startDate} />

      <SalaryInput 
        salary={salary} 
        salaryHandler={salaryHandler} 
        startBalance={startBalance} 
        startBalanceHandler={startBalanceHandler} 
        showPayCheckLines={showPayCheckLines} 
        showPayCheckLinesHandler={showPayCheckLinesHandler} />

      <BillsInput
        housingCost={housingCost}
        housingCostHandler={housingCostHandler} />

    </Stack>
    
  </div>
  );
}

export default PayCyclePage