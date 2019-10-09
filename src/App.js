import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ImgCont from './ImgCont';

function App() {
  const [dim, setDim] = useState([1000,800]);

  useEffect(() => {
    setDim([window.innerWidth, window.innerHeight]);
  }, [])

  console.log('dim', dim);
  return (
    <div className="App relative">
        <ImgCont width={dim[0]} height={dim[1]}/>
        <div className="fixed text-black bg-white box" style={{zIndex:-0}}><h1 className="uppercase text-4xl italic">This is art MotherFucker 💩!!!</h1>
          <p className="text-base"> This is an early sketch how you can present your paintings!</p>

        </div>
    </div>
  );
}

export default App;
