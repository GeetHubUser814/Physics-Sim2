import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec, LaTeX } from "mafs";
import React, { useEffect, useRef, useState } from 'react';
import Mather from './Mather';
import 'katex/dist/katex.min.css';

function WEPDProj(){
    //canvas
    const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.7, height: window.innerHeight * 0.5 })
    useEffect(() => {
        window.addEventListener('resize', () => {
            setDimensions({
                width: window.innerWidth * 0.7,
                height: window.innerHeight * 0.5
            });
        });
    }, [])
    const projPath = (x) => -0.01 * Math.pow(x + 27, 2);
    const projBall = useMovablePoint([-28, -1], {
        constrain: ([x, y]) => [x, projPath(x)]
    });
    return(
        <div className="FBD-container">
            <Mafs width={dimensions.width} height={dimensions.height} viewBox={{x: [-10, 10], y: [-10, 10]}} pan={false} zoom={false}>
                {/* setting */}
                <Line.Segment
                    point1={[-28, -7]}
                    point2={[100, -7]}
                />
                <Line.Segment
                    point1={[-28, -7]}
                    point2={[-28, -1]}
                />
                <Line.Segment
                    point1={[-28, -1]}
                    point2={[-100, -1]}
                />
                {/* setting */}
                {projBall.element}
            </Mafs>
        </div>
    );
}
export default WEPDProj