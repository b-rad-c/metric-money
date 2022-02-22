import React, { useState, useMemo } from 'react';
import { Stack } from 'react-bootstrap';
import PresetList from './Presets';
import { Bill, BillList, Generator, Transaction, TransactionList } from '../DataGenerator';
import { 
  SimulationInput,
  BillsInput, 
  formatUSD, 
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
    generator.configFinance(state.streamIncoming, state.streamOutgoing, state.stableCurrency, state.useDeFi)
    generator.configChart(state.fitToScreen)
    generator.expenses(bills, state.unexpectedTrans)
    return generator.run(state.startDate, state.simDuration)
  }, [state]);

  //
  // chart config
  //
  
  const chartWidth = useMemo(() => { 
    if(!state.fitToScreen && state.simDuration.years > 1) { 
      return 1500 * state.simDuration.years 
    } else {
       return "100%" 
      } 
  }, [state])
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
    <div className='border shadow-lg bg-light bg-gradient' style={{margin: '1rem auto', width: "98%", overflowX: "scroll"}}>

      <h1>Metric Money</h1>

      <ResponsiveContainer width={chartWidth} height={400}>
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
            state.showPayCheckLines && chartData.payChecks.map((payDate, index) => (
              <ReferenceLine key={index} x={payDate} stroke={variables.success} strokeDasharray="0" strokeWidth={2} />
            ))
          }

          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={gradientOffset} stopColor={variables.success} stopOpacity={1} />
              <stop offset={gradientOffset} stopColor={variables.danger} stopOpacity={1} />
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

    <Stack className="align-items-start justify-content-center" direction="horizontal" gap={3}>

      <SimulationInput 
        state={state} 
        updateState={updateState} />

      <BillsInput
        state={state}
        updateState={updateState} />

      <GraphOptions
        state={state}
        updateState={updateState}
        selectedPreset={selectedPreset}
        selectedPresetHandler={selectedPresetHandler} 
        chartData={chartData} />
      
      <ResultWidget 
        state={state}
        updateState={updateState}
        chartData={chartData} />

    </Stack>

  </div>
  );
}

export default MetricMoneyChart