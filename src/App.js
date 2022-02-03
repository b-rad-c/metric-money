import './App.css';
import { StreamingChart } from './components/StreamingChart';



function App() {
  return (
    <div className="App">
      <h1>Sample data</h1>
      <div style={{height: "600px", width: "1250px"}}>
        <StreamingChart />
      </div>
    </div>
  );
}

export default App;
