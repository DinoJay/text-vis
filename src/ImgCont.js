import React, { useEffect, useState } from "react";
import data from "./exampleData";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";

const makeScale = () => {
  return Math.max(0.5, Math.random());
};

const paintings = [
'https://img0.etsystatic.com/032/1/5873189/il_570xN.536535526_p6ab.jpg',
"https://i.pinimg.com/736x/dc/11/ed/dc11ed32b52891feeffa744d4bb45e6c--jd-salinger-painting-portraits.jpg",
'https://i.pinimg.com/originals/60/11/4e/60114e4d4dda53facd91d779629ca972.jpg',
'https://i.pinimg.com/736x/37/05/f8/3705f84e4ae81d0c2073da4e4b6958e7--jd-salinger-painting-portraits.jpg','https://i.pinimg.com/736x/2e/bb/81/2ebb81eb0948939cc51a579ea93ae5f5--jd-salinger-classroom-quotes.jpg',
'https://i.pinimg.com/736x/b8/94/28/b894287674865d4a1feb8c2123f43a80--writers-portraits-jd-salinger.jpg',
'https://mbird.com/wp-content/uploads/2011/03/9782020133272FS.jpg'
]






const prepData = data.map(d => ({ scale: makeScale(), ...d }));
const resetY = ( p, deltaY, sc, height) => {
  const np= (p.y + deltaY* sc)
  if(np> height) return -100
  if (np < -200 ) return height;
  return np;
}

export default function ImgCont(props) {
  const { width = 1000, height = 800 } = props;
  const [pos, setPos] = useState([]);
  const r = 150;
  const ref = React.useRef();
  useEffect(() => {
    console.log("ref current", ref.current);
    ref.current.addEventListener("wheel", e => {
      // console.log("yah", e);
      // const scrollTop = document.body.scrollTop;
      // console.log("scrollTop", e.target);


      setPos(pos =>
        pos.map(( p,i) => ({...p, y:resetY(p, e.deltaY, p.scale, height) }))
      );
    });
  }, [height]);


  useEffect(
    () => {
      const simulation = d3
        .forceSimulation()
      .alphaMin(0.7)
        // .force("x", d3.forceX(width / 2).strength(0.1))
        // .force("y", d3.forceY(height * 1 / 3).strength(0.1))
        .force('coll', d3.forceCollide(100).strength(2))
        .force(
          "boundary",
          forceBoundary(0, 0, width - r, 4 *height - r).strength(0.1)
          // .border(100)
          // .hardBoundary(true)
        )
        .force(
          "charge",
          d3
            .forceManyBody()
            // .distanceMin(2 * r)
            // .strength(-2000)
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .nodes(prepData.map(d => ({ ...d, x: width / 2, y: height / 2 })))
        .on("tick", () => {
          // console.log("sim", simulation.nodes());
          setPos(simulation.nodes());
        });
    },
    [height, width]
  );

  useEffect(() => {
    let counter =1;
    setInterval(() => {
      setPos(pos =>
        pos.map(( p,i) => ( { ...p, y: resetY(p, counter, p.scale, height) } ))
      );
    }, 20)
  }, [height])

  return (
    <div
      className="border-b-4 border-t-4 border-black "
      ref={ref}
      style={{ width, height: 800, position: "relative", overflow: "hidden" }}
    >
      {pos.map((d, i) => (
        <div
          onClick={() =>
            setPos(pos.map(p => p.id ===d.id ?({...p, selected:true}) : p ))}
          style={{
            transform: `translate3d(${d.x}px, ${d.y}px, ${d.scale*100}px) scale(${d.scale})`,
            position: "absolute"
          }}
        >
          <img
            alt={paintings[i % paintings.length]}
            src={paintings[i % paintings.length]}
            style={{
              opacity: d.selected ? 1:d.scale,
              width: d.selected ? 400 :r,
              height: d.selected ? 400 :r
            }}
          />
        </div>
      ))}
    </div>
  );
}
