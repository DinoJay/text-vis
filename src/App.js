import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ImgCont from './ImgCont';

function App() {
  const [dim, setDim] = useState([1000,800]);
  const [random, setRandom] = useState(false);

  useEffect(() => {
    setDim([window.innerWidth, window.innerHeight]);
  }, [])

  console.log('dim', dim);
  return (
    <div className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden">
        <ImgCont width={dim[0]} height={dim[1]} isGrid={random} />

          <div className="absolute bg-white box m-auto flex flex-col items-center"
          >
            <h1 className="text-center uppercase text-xl md:text-4xl italic underline">
              This is J.D. Salinger!! 🚬
            </h1>
            <p className="text-lg">
              Searching for paintings of J.D Salinger on DuckDuckGo gave me some nice Results. <br/>
                You can click on the images to expand them and read some
                quote!
              </p>
              <div className="flex">
                <button onClick={() => setRandom(!random)}className="m-auto text-xl font-bold underline">{ random ? 'Make a Mess!': 'Order!' }</button>

              </div>
            </div>
    </div>
  );
}

export default App;
