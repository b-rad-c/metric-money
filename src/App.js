import './App.css';
import { Outlet, NavLink } from "react-router-dom";



function App() {
  

  return (
    <div className="App">
      <h1>Metric Money</h1>
      <NavLink to="/">home</NavLink>&nbsp;|&nbsp;
      <NavLink to="/streaming">streaming</NavLink>&nbsp;|&nbsp;
      <NavLink to="/pay-cycle">pay cycle</NavLink>

      <Outlet />
      
    </div>
  );
}

export default App;
