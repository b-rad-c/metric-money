import React from 'react';
import { useState } from 'react';
import { StreamingChart } from './StreamingChart';


function StreamingPage() {
    const [inPerSec, setInPerSec] = useState(.004);
    const [outPerSec, setOutPerSec] = useState(.001);

  return (
  <div>
    <div className="xchart-scroller">
        <div className="chart-container-1">
          <StreamingChart 
            inPerSec={inPerSec} 
            outPerSec={outPerSec}

            />
        </div>
      </div>

      <hr/>

      in:  <input type="number" value={inPerSec}  step={.00025} onChange={e => setInPerSec(e.target.value)}  />
      out: <input type="number" value={outPerSec} step={.00025} onChange={e => setOutPerSec(e.target.value)} />

  </div>);
}

export default StreamingPage