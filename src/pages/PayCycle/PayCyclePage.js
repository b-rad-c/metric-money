import React, { useState, useMemo } from 'react';
import { Stack, Form, Button, ButtonGroup } from 'react-bootstrap';
import { generator } from './PayCycleSimulator';
import { add, format } from 'date-fns'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,  
  ReferenceArea
} from 'recharts';


function PayCyclePage() {
  // chart config
  const chartWidth = 2000
  const chartMargin = { top: 5, right: 20, bottom: 5, left: 0 }
  const tickFormatter = (label, index) => { return (label.startsWith('Jan') || index === 0) ? label : label.substring(0, label.length - 6) }

  // state variables and handlers
  const [startDate, setStartDate] = useState(new Date('Jan 01, 2021'));
  const startDateIncDay = () => { setStartDate(add(startDate, {days: 1})) }
  const startDateDecDay = () => { setStartDate(add(startDate, {days: -1})) }
  const startDateIncWeek = () => { setStartDate(add(startDate, {days: 7})) }
  const startDateDecWeek = () => { setStartDate(add(startDate, {days: -7})) }
  const startDateIncMonth = () => { setStartDate(add(startDate, {months: 1})) }
  const startDateDecMonth = () => { setStartDate(add(startDate, {months: -1})) }
  const startDateIncYear = () => { setStartDate(add(startDate, {years: 1})) }
  const startDateDecYear = () => { setStartDate(add(startDate, {years: -1})) }

  const [startBalance, setStartBalance] = useState(1000);
  const startBalanceHandler = (e) => { setStartBalance(parseInt(e.target.value)) }

  const [payAmount, setPayAmount] = useState(1000);
  const payAmountHandler = (e) => { setPayAmount(parseInt(e.target.value)) }

  const [showPayCheckLines, setShowPayCheckLines] = useState(true);
  const showPayCheckLinesHandler = (e) => { setShowPayCheckLines(e.target.checked) }

  

  const chartData = useMemo(() => {
    const payCycleData = generator(startDate, startBalance, payAmount, 370)
    console.log(payCycleData)
    return payCycleData
  }, [startDate, startBalance, payAmount]);
  

  

  return (
  <div style={{textAlign: "left"}}>

    <LineChart width={chartWidth} height={400} data={chartData.balanceData} margin={chartMargin}>
      <XAxis dataKey="label" ticks={chartData.months} tickFormatter={tickFormatter} />
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
      
      <Line type="stepBefore" dataKey="balance" stroke="black" strokeWidth={3} dot={false} isAnimationActive={false}/>

    </LineChart>

    <Stack direction="horizontal" gap={3}>
      <div><Form.Check type="switch" id="payCheckSwitch" label="show paychecks" onChange={showPayCheckLinesHandler} checked={showPayCheckLines}/></div>
    </Stack>

    <hr />

    <Stack direction="vertical" gap={3}>
      <div><strong>start date</strong></div>
      <div>
        <Stack direction="horizontal" gap={3}>
          <Button onClick={startDateDecMonth}>-</Button>
          {format(startDate, 'MMMM')}
          <Button onClick={startDateIncMonth}>+</Button>
        </Stack>
      </div>
      <div>
        <Stack direction="horizontal" gap={3}>
          <ButtonGroup>
            <Button onClick={startDateDecWeek}>-7</Button>
            <Button onClick={startDateDecDay}>-1</Button>
          </ButtonGroup>
          {format(startDate, 'do')}
          <ButtonGroup>
            <Button onClick={startDateIncDay}>+1</Button>
            <Button onClick={startDateIncWeek}>+7</Button>
          </ButtonGroup>
        </Stack>
      </div>
      <div>
        <Stack direction="horizontal" gap={3}>
          <Button onClick={startDateDecYear}>-</Button>
          {format(startDate, 'yyyy')}
          <Button onClick={startDateIncYear}>+</Button>
        </Stack>
      </div>
    </Stack>

    <hr />

    <Stack direction="vertical" gap={3}>
      <div>start balance: <input type="number" value={startBalance} onChange={startBalanceHandler} step={100} /></div>
      <div>pay amount: <input type="number" value={payAmount} onChange={payAmountHandler} step={100} /></div>
    </Stack>

    
    
    
    
    
  </div>
  );
}

export default PayCyclePage