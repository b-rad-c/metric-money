import React, { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { add } from 'date-fns'
import { Bill, BillList, Generator, Transaction, TransactionList } from '../DataGenerator';
import { 
  SimulationInput, 
  SalaryInput,
  BillsInput, 
  FinanceInput, 
  formatUSD, 
  ExpensesWidget, 
  ResultWidget,
  GraphOptions 
} from './Widgets'

import { 
  Area,
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,  
  ReferenceArea,
  ResponsiveContainer
} from 'recharts';

export const stackGap = 3

function MetricMoneyChart() {

  //
  // state variables and handlers
  //

  const [useStreaming, setUseStreaming] = useState(false);
  const useStreamingHandler = (e) => { setUseStreaming(e.target.checked) }

  const [useDeFi, setUseDeFi] = useState(false);
  const useDeFiHandler = (e) => { setUseDeFi(e.target.checked); }

  const [startDate, setStartDate] = useState(new Date('Jan 01, 2022'));
  const startDateHandler = (offset) => { setStartDate(add(startDate, offset)) }

  const [simDuration, setSimDuration] = useState({years: 1});
  const simDurationHandler = (years) => { setSimDuration({years: years}) }

  const [salary, setSalary] = useState(18000);
  const salaryHandler = (num) => { setSalary(salary + num) }

  const [startBalance, setStartBalance] = useState(200);
  const startBalanceHandler = (num) => { setStartBalance(startBalance + num) }

  const [showPayCheckLines, setShowPayCheckLines] = useState(true);
  const showPayCheckLinesHandler = (e) => { setShowPayCheckLines(e.target.checked) }

  const [fitToScreen, setFitToScreen] = useState(false);
  const fitToScreenHandler = (e) => { setFitToScreen(e.target.checked) }

  // unexpected transactions
  const [unexpectedTrans, setUnexpectedTrans] = useState(new TransactionList([]));

  function unexpectedHandler(e) {
    console.log(e)
    console.log(e.activeLabel)
    const newTrans = new Transaction('UNEXPECTED EXPENSE', 500, e.activeLabel)
    const newList = new TransactionList(unexpectedTrans.items.concat([newTrans]))
    console.log(newTrans)
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
  // chart data
  //

  const chartData = useMemo(() => {
    const generator = new Generator()
    generator.configSalary(startBalance, salary)
    generator.configFinance(useStreaming, useDeFi)
    generator.configChart(fitToScreen)
    generator.expenses(bills, unexpectedTrans)
    return generator.run(startDate, simDuration)
  }, [startDate, simDuration, startBalance, useStreaming, useDeFi, fitToScreen, salary, bills, unexpectedTrans]);

  //
  // chart config
  //
  
  const chartWidth = useMemo(() => { 
    if(!fitToScreen && simDuration.years > 1) { 
      return 1500 * simDuration.years 
    } else {
       return "100%" 
      } 
  }, [fitToScreen, simDuration])
  const chartMargin = { top: 20, right: 40, bottom: 20, left: 40 }

  const dateTickFormatter = (label, index) => { return (label.startsWith('Jan') || index === 0) ? label : label.substring(0, label.length - 8) }

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

  //
  // render
  //

  return (
  <div>
    {
      // 
      // line chart 
      //
    }
    <div className="center-margin" style={{width: "100%", overflowX: "scroll"}}>

      <ResponsiveContainer className="center-margin" width={chartWidth} height={400}>
        <AreaChart data={chartData.balanceData} margin={chartMargin} onClick={unexpectedHandler}>
          <XAxis dataKey="label" ticks={chartData.months} tickFormatter={dateTickFormatter} interval="preserveEnd" tickMargin={10} minTickGap={5} angle={0} />
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
      </ResponsiveContainer>

    </div>

    {
      //
      // inputs 
      //
    }

    <Container>
      <Row>
        <Col>
          <ResultWidget
          finalBalance={chartData.finalBalance}
          payChecks={chartData.payChecks}
          interestPaid={chartData.interestPaid}
          interestEarned={chartData.interestEarned} />
        </Col>
        
        <Col>
          <SimulationInput 
          startDateHandler={startDateHandler} 
          startDate={startDate} 
          simDuration={simDuration}
          simDurationHandler={simDurationHandler} />
        </Col>

        <Col>
          <GraphOptions
          fitToScreen={fitToScreen}
          fitToScreenHandler={fitToScreenHandler}
          showPayCheckLines={showPayCheckLines} 
          showPayCheckLinesHandler={showPayCheckLinesHandler} />
        </Col>
      </Row>

      <Row>
        <Col>
          <FinanceInput
          useStreaming={useStreaming}
          useStreamingHandler={useStreamingHandler}
          useDeFi={useDeFi}
          useDeFiHandler={useDeFiHandler}
          savingsRate={chartData.savingsRate}
          creditRate={chartData.creditRate} />
        </Col>

        <Col>
          <SalaryInput 
          salary={salary} 
          salaryHandler={salaryHandler} 
          startBalance={startBalance} 
          startBalanceHandler={startBalanceHandler} />
        </Col>

        <Col>
          <BillsInput
          housingCost={housingCost}
          housingCostHandler={housingCostHandler} 
          electricCost={electricCost}
          electricCostHandler={electricCostHandler}
          waterCost={waterCost}
          waterCostHandler={waterCostHandler} />
        </Col>

        <Col>
          <ExpensesWidget 
          transactions={unexpectedTrans} />
        </Col>
      </Row>
    </Container>
  </div>
  );
}

export default MetricMoneyChart