import React, { useEffect, useState } from "react";
import data from "./exampleData";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";
import clsx from 'clsx';
const setIntervalAsync = (fn, ms) => {
  new Promise(resolve => resolve(fn())).then(() => {
    setTimeout(() => setIntervalAsync(fn, ms), ms);
  });
};


const makeScale = () => {
  return Math.max(0.5, Math.random() * 1.1);
};

const R = 153;
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
'https://2.bp.blogspot.com/-kgJvYpz46iw/Tt86IrMhCII/AAAAAAAADi4/VKBwyu8gE-c/s640/catcher.jpg', 'https://i.etsystatic.com/9414719/R/il/d23c97/1155227448/il_570xN.1155227448_oog4.jpg', 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/a6af3b10857411.560ec807b37c3.jpg'
]

const prepData = data.map(d => ({ scale: makeScale(), ...d }));


const resetY = (p, deltaY, sc, height, pos) => {
  // console.log('deltaY', deltaY);
  const dy = deltaY;
  const np= (p.y + dy )
  if(np > Math.ceil( height/R )*R+R) return -R// if (np < -R ) return height;
  return np;
}

const resetYgrid = (p, deltaY, sc, height, pos,R) => {
  const limit=50;
  // console.log('deltaY', deltaY);
  const dy = Math.min(limit, Math.max(deltaY, -limit))/3;
  const minY = Math.max(pos.reduce((acc, p) => p.y+dy < acc ? p.y+dy:acc, Infinity), 0)

  const maxY =Math.min(Infinity, pos.reduce((acc, p) => p.y+dy > acc ? p.y+dy:acc, 0));

  const np= (p.y + dy )
  if(np > Math.ceil( height/R )*R+R) return minY-R// if (np < -R ) return height;
  if(np < -R) return maxY+R// if (np < -R ) return height;
  return np;
}

export default function ImgCont(props) {
  const { width = 1000, height = 800, columns=10, isGrid=false} = props;
  const [pos, setPos] = useState([]);
  const ref = React.useRef();
  useEffect(() => {
    ref.current.addEventListener("wheel", e => {
      setPos(pos =>
        pos.map(( p,i) => ({...p, y: resetYgrid(p, e.deltaY, p.scale, height, pos, R) }))
      );
    });
  }, [height]);


  useEffect(
    () => {
      let h = 0;
      let heights = new Array(columns).fill(-100);
      const visData = prepData.map(( d,i) => {
         const column = heights.indexOf(Math.min(...heights));

        return ({ ...d, tx: width / columns * column, ty:
          (heights[column] += R) }) })


      const simulation = d3
        .forceSimulation()
        .alphaMin(0.5)
        .force("x", d3.forceX(d=> d.tx).strength(isGrid ? 2 :0))
        .force("y", d3.forceY(d=> d.ty).strength(isGrid ? 1: 0.01))
        .force('coll', d3.forceCollide(100).strength(0.1))
        .force(
          "boundary",
          forceBoundary(0, 0, width - R, 4 *height - R).strength(0.1)
          // .border(100)
          // .hardBoundary(true)
        )
        .force(
          "charge",
          d3
            .forceManyBody()
            // .distanceMin(2 * R)
            .strength(-700)
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .nodes(visData)
        .on("tick", () => {
          setPos(simulation.nodes());
        });
    },
    [columns, height, isGrid, width]
  );
  //
  useEffect(() => {
    let counter =2;
    setInterval(() => {
      setPos(pos =>
          pos.map(( p,i) => ( p.selected ? p:{ ...p, y: resetYgrid(p, counter, p.scale, height, pos, R) } ))
      );
    }, 4)
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
            transform: `translate3d(${d.x}px, ${d.selected? height/2-300:d.y}px, ${d.selected ? 5000 :d.scale*100}px) scale(${!isGrid ? d.scale:1})`,
            // transition: 'all 300ms'
          }}
        >
          <div style={{
                zIndex: d.selected ? 500: 0,
                transition: 'all 400ms',
                opacity: d.selected ? 1:d.scale,
                width: d.selected ? 400 :R,
                height: d.selected ? 400 :R

          }}>
            <img
              alt={paintings[i % paintings.length]}
              src={paintings[i % paintings.length]}
              style={{
                zIndex: d.selected ? 500: 0,
                transition: 'all 400ms',
                opacity: d.selected ? 1:d.scale,
                width: d.selected ? 400 :R,
                height: d.selected ? 400 :R
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
