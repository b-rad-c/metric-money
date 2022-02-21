import React, { useState, useMemo } from 'react';
import { CardGroup } from 'react-bootstrap';
import { add } from 'date-fns'
import { clamp } from 'lodash'
import { Bill, BillList, Generator, Transaction, TransactionList } from '../DataGenerator';
import PresetList from './Presets';
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

const preset = PresetList[0]

function MetricMoneyChart() {

  //
  // state variables and handlers
  //

  const [useStreaming, setUseStreaming] = useState(preset.useStreaming);
  const useStreamingHandler = (e) => { setUseStreaming(e.target.checked) }

  const [useDeFi, setUseDeFi] = useState(preset.useDeFi);
  const useDeFiHandler = (e) => { setUseDeFi(e.target.checked); }

  const [startDate, setStartDate] = useState(preset.startDate);
  const startDateHandler = (offset) => { setStartDate(add(startDate, offset)) }

  const [simDuration, setSimDuration] = useState(preset.simDuration);
  const simDurationHandler = (years) => { setSimDuration({years: years}) }

  const [salary, setSalary] = useState(preset.salary);
  const salaryHandler = (num) => { setSalary(salary + num) }

  const [startBalance, setStartBalance] = useState(preset.startBalance);
  const startBalanceHandler = (num) => { setStartBalance(startBalance + num) }

  const [showPayCheckLines, setShowPayCheckLines] = useState(preset.showPayCheckLines);
  const showPayCheckLinesHandler = (e) => { setShowPayCheckLines(e.target.checked) }

  const [fitToScreen, setFitToScreen] = useState(preset.fitToScreen);
  const fitToScreenHandler = (e) => { setFitToScreen(e.target.checked) }

  // unexpected transactions
  const [unexpectedTrans, setUnexpectedTrans] = useState(preset.unexpectedTrans);

  function unexpectedHandler(e) {
    const newTrans = new Transaction('UNEXPECTED EXPENSE', 500, e.activeLabel)
    const newList = new TransactionList(unexpectedTrans.items.concat([newTrans]))
    setUnexpectedTrans(newList)
  }

  // bill inputs
  const [housingCost, setHousingCost] = useState(preset.housingCost);
  const housingCostHandler = (num) => { setHousingCost(housingCost + num) }

  const [housingDue, setHousingDue] = useState(preset.housingDue);
  const housingDueHandler = (num) => { setHousingDue(clamp(housingDue + num, 1, 27)) }

  const [carCost, setCarCost] = useState(preset.carCost);
  const carCostHandler = (num) => { setCarCost(carCost + num) }

  const [carDue, setCarDue] = useState(preset.carDue);
  const carDueHandler = (num) => { setCarDue(clamp(carDue + num, 1, 27)) }

  const [electricCost, setElectricCost] = useState(preset.electricCost);
  const electricCostHandler = (num) => { setElectricCost(electricCost + num) }

  const [electricDue, setElectricDue] = useState(preset.electricDue);
  const electricDueHandler = (num) => { setElectricDue(clamp(electricDue + num, 1, 27)) }

  const [waterCost, setWaterCost] = useState(preset.waterCost);
  const waterCostHandler = (num) => { setWaterCost(waterCost + num) }

  const [waterDue, setWaterDue] = useState(preset.waterDue);
  const waterDueHandler = (num) => { setWaterDue(clamp(waterDue + num, 1, 27)) }

  const bills = useMemo(() => {

    return new BillList([
      new Bill('HOUSING', housingCost, housingDue),
      new Bill('CAR', carCost, carDue),
      new Bill('ELECTRIC', electricCost, electricDue),
      new Bill('WATER', waterCost, waterDue)
    ])

  }, [housingCost, housingDue, electricCost, electricDue, waterCost, waterDue, carCost, carDue])


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

    <CardGroup>
      <SimulationInput 
          startDateHandler={startDateHandler} 
          startDate={startDate} 
          simDuration={simDuration}
          simDurationHandler={simDurationHandler} />
        
        <FinanceInput
          useStreaming={useStreaming}
          useStreamingHandler={useStreamingHandler}
          useDeFi={useDeFi}
          useDeFiHandler={useDeFiHandler}
          savingsRate={chartData.savingsRate}
          creditRate={chartData.creditRate} />

        <GraphOptions
          fitToScreen={fitToScreen}
          fitToScreenHandler={fitToScreenHandler}
          showPayCheckLines={showPayCheckLines} 
          showPayCheckLinesHandler={showPayCheckLinesHandler} />
        
        <ResultWidget
          finalBalance={chartData.finalBalance}
          payChecks={chartData.payChecks}
          interestPaid={chartData.interestPaid}
          interestEarned={chartData.interestEarned} />
      </CardGroup>

      <CardGroup>
        <SalaryInput 
          salary={salary} 
          salaryHandler={salaryHandler} 
          startBalance={startBalance} 
          startBalanceHandler={startBalanceHandler} />

        <BillsInput
          housingCost={housingCost}
          housingCostHandler={housingCostHandler} 
          housingDue={housingDue}
          housingDueHandler={housingDueHandler}

          carCost={carCost}
          carCostHandler={carCostHandler}
          carDue={carDue}
          carDueHandler={carDueHandler}

          electricCost={electricCost}
          electricCostHandler={electricCostHandler}
          electricDue={electricDue}
          electricDueHandler={electricDueHandler}

          waterCost={waterCost}
          waterCostHandler={waterCostHandler} 
          waterDue={waterDue}
          waterDueHandler={waterDueHandler} 
          />

        <ExpensesWidget 
          transactions={unexpectedTrans} />
      </CardGroup>
  </div>
  );
}

export default MetricMoneyChart