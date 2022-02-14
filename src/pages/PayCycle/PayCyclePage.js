import React, { useState, useMemo } from 'react';
import { Stack, Form, Button, ButtonGroup, Card } from 'react-bootstrap';
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

const dateTickFormatter = (label, index) => { return (label.startsWith('Jan') || index === 0) ? label : label.substring(0, label.length - 6) }
const formatUSD = (num) => { return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(num) }


function PayCyclePage() {
  // chart config
  const chartWidth = 2000
  const chartMargin = { top: 5, right: 20, bottom: 5, left: 0 }

  // state variables and handlers
  const [startDate, setStartDate] = useState(new Date('Jan 01, 2021'));
  const startDateHandler = (offset) => { setStartDate(add(startDate, offset)) }

  const [salary, setSalary] = useState(42000);
  const salaryHandler = (num) => { setSalary(salary + num) }
  const payCheckAmount = useMemo(() => { return salary / 26 }, [salary])

  const [startBalance, setStartBalance] = useState(1000);
  const startBalanceHandler = (num) => { setStartBalance(startBalance + num) }

  const [showPayCheckLines, setShowPayCheckLines] = useState(true);
  const showPayCheckLinesHandler = (e) => { setShowPayCheckLines(e.target.checked) }

  const chartData = useMemo(() => {
    const payCycleData = generator(startDate, startBalance, payCheckAmount, 370)
    console.log(payCycleData)
    return payCycleData
  }, [startDate, startBalance, payCheckAmount]);

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
      
      <Line type="stepBefore" dataKey="balance" stroke="black" strokeWidth={3} dot={false} isAnimationActive={false}/>

    </LineChart>

    {
      /* inputs */
    }
    
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title className="center-text">Start date</Card.Title>
        <Card.Text>
          <Stack direction="vertical" gap={3}>
            <div className="center-margin">
              <Stack direction="horizontal" gap={3}>
                <Button onClick={() => { startDateHandler({months: -1}) }}>-</Button>
                {format(startDate, 'MMMM')}
                <Button onClick={() => { startDateHandler({months: 1}) }}>+</Button>
              </Stack>
            </div>
            <div className="center-margin">
              <Stack direction="horizontal" gap={3}>
                <ButtonGroup>
                  <Button onClick={() => { startDateHandler({days: -7}) }}>-7</Button>
                  <Button onClick={() => { startDateHandler({days: -1}) }}>-1</Button>
                </ButtonGroup>
                {format(startDate, 'do')}
                <ButtonGroup>
                  <Button onClick={() => { startDateHandler({days: 1}) }}>+1</Button>
                  <Button onClick={() => { startDateHandler({days: 7}) }}>+7</Button>
                </ButtonGroup>
              </Stack>
            </div>
            <div className="center-margin">
              <Stack direction="horizontal" gap={3}>
                <Button onClick={() => { startDateHandler({years: -1}) }}>-</Button>
                {format(startDate, 'yyyy')}
                <Button onClick={() => { startDateHandler({years: 1}) }}>+</Button>
              </Stack>
            </div>
          </Stack>
        </Card.Text>
      </Card.Body>
    </Card>


    <Card style={{ width: '25rem' }}>
      <Card.Body>
        <Card.Title className="center-text">Salary</Card.Title>
        <Card.Text className="center-margin">
          <Stack direction="vertical" gap={3}>

            <strong>annual salary</strong>
            <div className="center-margin">
              <Stack direction="horizontal" gap={3}>
                <ButtonGroup>
                  <Button onClick={() => { salaryHandler(-1000) }}>-$1k</Button>
                  <Button onClick={() => { salaryHandler(-100) }}>-$100</Button>
                </ButtonGroup>
                {formatUSD(salary)}
                <ButtonGroup>
                  <Button onClick={() => { salaryHandler(100) }}>$100</Button>
                  <Button onClick={() => { salaryHandler(1000) }}>$1k</Button>
                </ButtonGroup>
              </Stack>
            </div>

            <strong>start balance</strong>
            <div className="center-margin">
              <Stack direction="horizontal" gap={3}>
                <ButtonGroup>
                  <Button onClick={() => { startBalanceHandler(-1000) }}>-$1k</Button>
                  <Button onClick={() => { startBalanceHandler(-100) }}>-$100</Button>
                </ButtonGroup>
                {formatUSD(startBalance)}
                <ButtonGroup>
                  <Button onClick={() => { startBalanceHandler(100) }}>$100</Button>
                  <Button onClick={() => { startBalanceHandler(1000) }}>$1k</Button>
                </ButtonGroup>
              </Stack>
            </div>
            <div className="center-margin">
              <Form.Check type="switch" id="payCheckSwitch" label="show paycheck markers" onChange={showPayCheckLinesHandler} checked={showPayCheckLines}/>
            </div>
          </Stack>
        </Card.Text>
      </Card.Body>
    </Card>
    
  </div>
  );
}

export default PayCyclePage