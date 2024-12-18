import React, { useState, useMemo } from 'react';
import { Stack } from 'react-bootstrap';
import PresetList from './Presets';
import { Bill, BillList, Generator, Transaction, TransactionList } from '../DataGenerator';
import { 
  FinancialSituation,
  Bills, 
  formatUSD, 
  Result,
  Options 
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

import variables from '../index.scss';


function MetricMoneyChart() {

  //
  // state management
  //

  const [selectedPreset, setSelectedPreset] = useState(0);
  const selectedPresetHandler = (e) => { 
    const i = e.target.options.selectedIndex - 1
    console.log('changing preset', i)
    setSelectedPreset(i) 
    setState(PresetList[i])
  }

  const [state, setState] = useState(PresetList[selectedPreset]);
  const updateState = (prop, value) => {
    setSelectedPreset(-1) // change preset dropdown to indicate form has changed
    setState(prevState => {
      const updates = {}
      updates[prop] = value
      return {...prevState, ...updates}
    })
  }

  function unexpectedHandler(e) {
    const newTrans = new Transaction('UNEXPECTED EXPENSE', 500, e.activeLabel)
    const newList = new TransactionList(state.unexpectedTrans.items.concat([newTrans]))
    updateState('unexpectedTrans', newList)
  }

  //
  // chart data
  //

  const chartData = useMemo(() => {
    const bills = new BillList([
      new Bill('HOUSING', state.housingCost, state.housingDue),
      new Bill('CAR', state.carCost, state.carDue),
      new Bill('ELECTRIC', state.electricCost, state.electricDue),
      new Bill('WATER', state.waterCost, state.waterDue)
    ])
    const generator = new Generator()
    generator.configSalary(state.startBalance, state.salary)
    generator.configFinance(state.streamIncoming, state.streamOutgoing, state.useInflation, state.inflationRate)
    generator.configChart(state.fitToScreen)
    generator.expenses(bills, state.unexpectedTrans)
    
    // console.log(JSON.stringify(Object.fromEntries(Object.entries(state).sort()), null, 2))
    return generator.run(state.startDate, state.simDuration, state.extraDay)
  }, [state]);

  //
  // chart config
  //
  
  const chartWidth = useMemo(() => { 
    if(!state.fitToScreen && state.simDuration.years > 1) { 
      return 1500 * state.simDuration.years 
    } else {
       return '100%' 
      } 
  }, [state])
  const chartMargin = { top: 20, right: 40, bottom: 20, left: 40 }

  const dateTickFormatter = (label, index) => { return (label.startsWith('Jan') || index === 0) ? label : label.substring(0, label.length - 8) }

  // used to color area chart green or red for positive/negative
  const gradientOffset = useMemo(() => { 
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

  // set yAxis domain values to make the chart easier to read when making small adjustments
  const yAxis = useMemo(() => {
    const max = Math.max(chartData.finalBalance, state.startBalance)
    let domain;
    let ticks;

    if(max <= 5000) {
      domain = [-1000, 5000]
      ticks = [-1000, 0, 2500, 5000]
    }else if(max <= 15000) {
      domain = [-1000, 15000]
      ticks = [-1000, 0, 5000, 10000, 15000]
    }else if(max <= 25000) {
      domain = [-1000, 25000]
      ticks = [-1000, 0, 5000, 15000, 25000]
    }else if(max <= 50000) {
      domain = [-2500, 50000]
      ticks = [-2500, 0, 10000, 20000, 30000, 40000, 50000]
    }else{
      domain = [-5000, 100000]
      ticks = [-5000, 0, 25000, 50000, 75000, 100000]
    }

    return {domain, ticks}
  }, [state, chartData])

  

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
    <div className='border shadow-lg bg-light bg-gradient' style={{margin: '1rem auto', width: '98%', overflowX: 'scroll'}}>

      <h1>Metric Money</h1>

      <ResponsiveContainer width={chartWidth} height={400}>
        <AreaChart data={chartData.balanceData} margin={chartMargin} onClick={unexpectedHandler}>
          <XAxis dataKey='label' ticks={chartData.months} tickFormatter={dateTickFormatter} interval='preserveEnd' tickMargin={10} minTickGap={5} angle={0} />
          <YAxis tickFormatter={(value) => formatUSD(value)} domain={yAxis.domain} ticks={yAxis.ticks} allowDataOverflow={true}/>
          <Tooltip formatter={(value, name) => [formatUSD(value), name]} />
          { // alternating background for each month
            chartData.bkgdIntervals.map((bkgdInt, index) => (
              <ReferenceArea key={'bkgd-' + index} x1={bkgdInt[0]} x2={bkgdInt[1]} stroke='none' strokeOpacity={0.3} />
            ))
          }

          { // pay check reference lines
            state.showPayCheckLines && chartData.payChecks.map((payDate, index) => (
              <ReferenceLine key={index} x={payDate} stroke={variables.success} strokeDasharray='0' strokeWidth={2} />
            ))
          }

          <defs>
            <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
              <stop offset={gradientOffset} stopColor={variables.success} stopOpacity={1} />
              <stop offset={gradientOffset} stopColor={variables.danger} stopOpacity={1} />
            </linearGradient>
          </defs>
          
          <Area type='stepAfter' dataKey='balance' stroke='black' strokeWidth={3} dot={false} isAnimationActive={false} fill='url(#splitColor)'/>
        </AreaChart>
      </ResponsiveContainer>

    </div>

    {
      //
      // inputs 
      //
    }

    <Stack className='align-items-start justify-content-center' direction='horizontal' gap={3}>

      <FinancialSituation 
        state={state} 
        updateState={updateState} />

      <Bills
        state={state}
        updateState={updateState} />

      <Options
        state={state}
        updateState={updateState}
        selectedPreset={selectedPreset}
        selectedPresetHandler={selectedPresetHandler} 
        chartData={chartData} />
      
      <Result 
        state={state}
        updateState={updateState}
        chartData={chartData} />

    </Stack>

  </div>
  );
}

export default MetricMoneyChart