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
    <div className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden">
        <ImgCont width={dim[0]} height={dim[1]}/>

        <div className="fixed h-screen w-screen flex pointer-events-none">
          <div className="bg-white box m-auto"
            style={{zIndex:-0}}>
            <h1 className="text-center uppercase text-xl md:text-4xl italic">
              This is art MotherFucker 💩!!!
            </h1>
            <p className="text-base">
              This is an early sketch how you can present your
              paintings!.
                You can click on the images to expand them and read some
                text!
              </p>

            </div>
            </div>
    </div>
  );
}

export default App;
