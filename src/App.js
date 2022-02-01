import './App.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { testData } from './Lib';

const dateFormatter = input => {
  let date = new Date(input)
  return date.getMonth() + ' ' + date.getDate()
};


//types: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' 
const renderLineChart = (
  <LineChart width={1250} height={600} data={testData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="natural" dataKey="amount" stroke="#8884d8" dot={false}/>
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="label" type="number" scale="time" domain={[testData[0].label, testData[testData.length - 1].label]} tickFormatter={dateFormatter}/>
    <YAxis />
    <Tooltip />
  </LineChart>
);



function App() {
  return (
    <div className="App">
      <h1>Sample data</h1>
      <div style={{height: "600px", width: "1250px"}}>
        {/*<MyResponsiveLine data={sampleData}/>*/}
        {renderLineChart}
      </div>
    </div>
  );
}

export default App;
