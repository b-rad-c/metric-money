import React, { useState, useMemo } from 'react';
import { Stack } from 'react-bootstrap';
import { Bill, BillList, Generator, Transaction, TransactionList } from '../DataGenerator';
import { StartDateInput, SalaryInput, BillsInput, FinanceInput, formatUSD, TransactionWidget, ResultWidget } from './Widgets'
import { add } from 'date-fns'
import { 
  Area,
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,  
  ReferenceArea
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
    const newList = new TransactionList(unexpectedTrans.items.concat([newTrans]))
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
    generator.expenses(bills, unexpectedTrans)
    return generator.run(startDate, 700)
  }, [startDate, startBalance, useStreaming, useDeFi, salary, bills, unexpectedTrans]);

  //
  // chart config
  //
  
  const chartWidth = 1750
  const chartMargin = { top: 20, right: 0, bottom: 20, left: 30 }

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
      //
      // inputs 
      //
    }

    <ResultWidget
      finalBalance={chartData.finalBalance}
      payChecks={chartData.payChecks}
      interestPaid={chartData.interestPaid}
      interestEarned={chartData.interestEarned}
      savingsRate={chartData.savingsRate}
      creditRate={chartData.creditRate}
      />

    <Stack direction="horizontal" gap={stackGap}>
      <StartDateInput 
        startDateHandler={startDateHandler} 
        startDate={startDate} />

      <FinanceInput
        useStreaming={useStreaming}
        useStreamingHandler={useStreamingHandler}
        useDeFi={useDeFi}
        useDeFiHandler={useDeFiHandler}
        />

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

      <TransactionWidget 
        transactions={unexpectedTrans}
      />

    </Stack>
    
  </div>
  );
}

export default MetricMoneyChart