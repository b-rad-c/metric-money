import './App.css';
import { StreamingChart } from './components/StreamingChart';



function App() {
  return (
    <div className="App">
      <h1>Sample data</h1>
      <div className="xchart-scroller">
        <div className="chart-container-1">
          <StreamingChart/>
        </div>
      </div>
      
    </div>
  );
}

export default App;
