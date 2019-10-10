import React, { useEffect, useState } from "react";
import data from "./exampleData";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";
import clsx from 'clsx';

const makeScale = () => {
  return Math.max(0.5, Math.random() * 1.1);
};

const quotes = ["I am always saying 'Glad to've met you' to somebody I'm not at all glad I met. If you want to stay alive, you have to say that stuff, though.", 'The mark of the immature man is that he wants to die nobly for a cause, while the mark of the mature man is that he wants to live humbly for one.',
  " That's the thing about girls. Every time they do something pretty, even if they're not much to look at, or even if they're sort of stupid, you fall in love with them, and then you never know where the hell you are. Girls. Jesus Christ. They can drive you crazy. They really can.", "When you're dead, they really fix you up. I hope to hell when I do die somebody has sense enough to just dump me in the river or something. Anything except sticking me in a goddam cemetery. People coming and putting a bunch of flowers on your stomach on Sunday, and all that crap. Who wants flowers when you're dead? Nobody." ]

const paintings = [
'https://img0.etsystatic.com/032/1/5873189/il_570xN.536535526_p6ab.jpg',
"https://i.pinimg.com/736x/dc/11/ed/dc11ed32b52891feeffa744d4bb45e6c--jd-salinger-painting-portraits.jpg",
'https://i.pinimg.com/originals/60/11/4e/60114e4d4dda53facd91d779629ca972.jpg',
'https://i.pinimg.com/736x/37/05/f8/3705f84e4ae81d0c2073da4e4b6958e7--jd-salinger-painting-portraits.jpg','https://i.pinimg.com/736x/2e/bb/81/2ebb81eb0948939cc51a579ea93ae5f5--jd-salinger-classroom-quotes.jpg',
'https://i.pinimg.com/736x/b8/94/28/b894287674865d4a1feb8c2123f43a80--writers-portraits-jd-salinger.jpg',
'https://mbird.com/wp-content/uploads/2011/03/9782020133272FS.jpg',
'http://pspguides.net/images/essay-scholarships-2009_68128938.jpg',
'https://mir-s3-cdn-cf.behance.net/project_modules/disp/776c8610857411.560ec71a4bfb1.jpg',
'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/salinger-bobby-zeik.jpg',
'https://2.bp.blogspot.com/-kgJvYpz46iw/Tt86IrMhCII/AAAAAAAADi4/VKBwyu8gE-c/s640/catcher.jpg', 'https://i.etsystatic.com/9414719/r/il/d23c97/1155227448/il_570xN.1155227448_oog4.jpg', 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/a6af3b10857411.560ec807b37c3.jpg'
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
                           pos.map(( p,i) => ( p.selected ? p:{ ...p, y: resetY(p, counter, p.scale, height) } ))
      );
    }, 20)
  }, [height])

  return (
    <div
      className="border-b-8 border-t-8 border-black "
      ref={ref}
      style={{ width, height: '80vh', position: "relative", overflow: "hidden",
  backgroundColor: 'beige'
      }}
    >
      {pos.map((d, i) => (
        <div
          className={ clsx( d.selected && 'z-50',"absolute cursor-pointer " ) }
          onClick={() =>
            setPos(pos.map(p => p.id ===d.id ?({...p, selected:!d.selected}) : p ))}
          style={{
            transform: `translate3d(${d.x}px, ${d.selected? height/2-300:d.y}px, ${d.selected ? 5000 :d.scale*100}px) scale(${d.scale})`,
          }}
        >
          <div style={{
                zIndex: d.selected ? 500: 0,
                transition: 'all 400ms',
                opacity: d.selected ? 1:d.scale,
                width: d.selected ? 400 :r,
                height: d.selected ? 400 :r

          }}>
            <img
              alt={paintings[i % paintings.length]}
              src={paintings[i % paintings.length]}
              style={{
                zIndex: d.selected ? 500: 0,
                transition: 'all 400ms',
                opacity: d.selected ? 1:d.scale,
                width: d.selected ? 400 :r,
                height: d.selected ? 400 :r
              }}
            />
            <div className={clsx(d.selected ? 'opacity-100' : 'opacity-0', 'p-2 text-black bg-white border-black border-2 italic')} style={{transition: 'all 300ms'}}>
              {quotes[i%quotes.length]}

            </div>
            </div>
        </div>
      ))}
    </div>
  );
}
