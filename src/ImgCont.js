import React, { useEffect, useState } from "react";
import data from "./exampleData";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";

const makeScale = () => {
  return Math.max(0.5, Math.random());
};

const prepData = data.map(d => ({ scale: makeScale(), ...d }));

export default function ImgCont(props) {
  const { width = 1000, height = 2600 } = props;
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
        pos.map(p => [p[0], p[1] + e.deltaY/2 + (e.deltaY  * Math.random()) ])
      );
    });
  }, []);

  useEffect(
    () => {
      const simulation = d3
        .forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height * 1 / 3).strength(0.1))
        .force(
          "boundary",
          forceBoundary(0, 0, width - r, height - r).strength(0.01)
          // .border(g00)
          // .hardBoundary(true)
        )
        .force(
          "charge",
          d3
            .forceManyBody()
            // .distanceMin(2 * r)
            .strength(-2000)
        )
        // .force("center", d3.forceCenter(width / 2, height / 2))
        .nodes(prepData.map(d => ({ ...d, x: width / 2, y: height / 2 })))
        .on("tick", () => {
          console.log("sim", simulation.nodes());
          setPos(simulation.nodes().map(d => [d.x, d.y]));
        });
    },
    [height, width]
  );
  return (
    <div
      ref={ref}
      style={{ width, height: 800, position: "relative", overflow: "hidden" }}
    >
      {pos.map((d, i) => (
        <div
          style={{
            // transition: 'transform 300ms',
            transform: `translate(${d[0]}px, ${d[1]}px) scale(${prepData[i]
              .scale})`,
            position: "absolute"
          }}
        >
          <img
            src="https://i.pinimg.com/736x/dc/11/ed/dc11ed32b52891feeffa744d4bb45e6c--jd-salinger-painting-portraits.jpg"
            style={{
              opacity: prepData[i].scale,
              width: r,
              height: r
            }}
          />
        </div>
      ))}
    </div>
  );
}
