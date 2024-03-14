import logo from './logo.svg';
import './App.css';
import './Styling/index.css'
import './Styling/index.scss'

import Login from './Pages/Login';
// import { useRecoilValue } from 'recoil';
import { updateCount } from './Recoil/count.recoil';

function App() {
  // const counterValue = useRecoilValue(updateCount)
  // console.log("🚀 ~ App ~ counterValue:", counterValue)
  return (
    <div className="App">
      <Login />
    </div>
  
  );
}

export default App;
