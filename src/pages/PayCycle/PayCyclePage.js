import React, { useState, useMemo } from 'react';
import { Stack, Form } from 'react-bootstrap';
import { Bill, BillList, generator, Transaction, TransactionList } from './PayCycleSimulator';
import { StartDateInput, SalaryInput, BillsInput, formatUSD } from './PayCheckInputs'
import { add } from 'date-fns'
import { stackGap } from '../../index';
import { 
  Area,
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,  
  ReferenceArea
} from 'recharts';

function PayCyclePage() {

  // chart config
  const chartWidth = 1750
  const chartMargin = { top: 20, right: 0, bottom: 20, left: 30 }

  //
  // state variables and handlers
  //

  const [useStreaming, setUseStreaming] = useState(false);
  const useStreamingHandler = (e) => { setUseStreaming(e.target.checked) }

  const [startDate, setStartDate] = useState(new Date('Jan 01, 2022'));
  const startDateHandler = (offset) => { setStartDate(add(startDate, offset)) }

  const [salary, setSalary] = useState(18000);
  const salaryHandler = (num) => { setSalary(salary + num) }

  const [startBalance, setStartBalance] = useState(200);
  const startBalanceHandler = (num) => { setStartBalance(startBalance + num) }

  const [showPayCheckLines, setShowPayCheckLines] = useState(true);
  const showPayCheckLinesHandler = (e) => { setShowPayCheckLines(e.target.checked) }

  // unexpected transactions
  const [unexpectedTrans, setUnexpectedTrans] = useState(new TransactionList([]));

  function unexpectedHandler(e) {
    const newTrans = new Transaction('UNEXPECTED EXPENSE', 500, e.activeLabel)
    const newList = new TransactionList(unexpectedTrans.transactions.concat([newTrans]))
    setUnexpectedTrans(newList)
  }

  // bill inputs
  const [housingCost, setHousingCost] = useState(1000);
  const housingCostHandler = (num) => { setHousingCost(housingCost + num) }

  const [electricCost, setElectricCost] = useState(150);
  const electricCostHandler = (num) => { setElectricCost(electricCost + num) }

  const [waterCost, setWaterCost] = useState(100);
  const waterCostHandler = (num) => { setWaterCost(waterCost + num) }

  const bills = useMemo(() => {

    return new BillList([
      new Bill('HOUSING', housingCost, 1),
      new Bill('ELECTRIC', electricCost, 15),
      new Bill('WATER', waterCost, 25)
    ])

  }, [housingCost, electricCost, waterCost])


  //
  // chart data and config
  //

  const chartData = useMemo(() => {
    console.log(unexpectedTrans)
    return generator(startDate, startBalance, useStreaming, salary, bills, unexpectedTrans, 365)
  }, [startDate, startBalance, useStreaming, salary, bills, unexpectedTrans]);

  const dateTickFormatter = (label, index) => { return (label.startsWith('Jan') || index === 0) ? label : label.substring(0, label.length - 6) }

  const gradientOffset = useMemo(() => { // used to color area chart green or red
    const dataMax = Math.max(...chartData.balanceData.map((i) => i.balance));
    const dataMin = Math.min(...chartData.balanceData.map((i) => i.balance));
  
    if (dataMax <= 0) {
      return 0
    }
    if (dataMin >= 0) {
      return 1
    }
    return dataMax / (dataMax - dataMin)

  }, [chartData])

  return (
  <div style={{textAlign: "left"}}>
    {
      /* line chart */
    }

    <AreaChart width={chartWidth} height={400} data={chartData.balanceData} margin={chartMargin} onClick={unexpectedHandler}>
      <XAxis dataKey="label" ticks={chartData.months} tickFormatter={dateTickFormatter} interval="preserveStart" tickMargin={10} />
      <YAxis tickFormatter={(value) => formatUSD(value)} />
      <Tooltip formatter={(value, name) => [formatUSD(value), name]} />
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

      <defs>
        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset={gradientOffset} stopColor="green" stopOpacity={1} />
          <stop offset={gradientOffset} stopColor="red" stopOpacity={1} />
        </linearGradient>
      </defs>
      
      <Area type="stepAfter" dataKey="balance" stroke="black" strokeWidth={3} dot={false} isAnimationActive={false} fill="url(#splitColor)"/>

    </AreaChart>

    {
      /* inputs */
    }

    final balance: { formatUSD(chartData.finalBalance) }<br />
    total paychecks: { chartData.payChecks.length }

    <Form.Check type="switch" id="streamingSwitch" label="streaming" onChange={useStreamingHandler} checked={useStreaming}/>

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
        housingCostHandler={housingCostHandler} 
        electricCost={electricCost}
        electricCostHandler={electricCostHandler}
        waterCost={waterCost}
        waterCostHandler={waterCostHandler} />

    </Stack>
    
  </div>
  );
}

export default PayCyclePage