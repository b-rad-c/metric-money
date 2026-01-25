import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import MetricMoneyChart from './components/Chart.js'

function MetricMoney() {

  return (
    <div className='app position-absolute top-0 start-0 text-center bg-primary bg-gradient'>
      <MetricMoneyChart />
    </div>
  )
}


const root = createRoot(document.getElementById('root'))
root.render(<MetricMoney />)
