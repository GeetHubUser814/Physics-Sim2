import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec, LaTeX } from "mafs";
import React, { useEffect, useRef, useState } from 'react';
import Mather from './Mather';
import 'katex/dist/katex.min.css';

function WEPDPend(){
    //canvas
    const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.7, height: window.innerHeight * 0.5 })
    useEffect(() => {
        window.addEventListener('resize', () => {
            setDimensions({
                width: window.innerWidth * 0.7,
                height: window.innerHeight * 0.5
            });
        });
    }, []);
    const bInfo = {
        start: [0, -6],
        rad: 1,
        domain: [-12, 12],
        pivot: [0, 14],
        mass: 1
    }
    const pendRad = bInfo.pivot[1] - bInfo.start[1];
    const pendPath = (x) => -1 * Math.sqrt(Math.pow(pendRad, 2) - Math.pow(x, 2)) + bInfo.pivot[1];
    const [pastMidPeriod, setPastMidPeriod] = useState(false);
    const pBall = useMovablePoint([bInfo.start[0], bInfo.start[1]], {
        constrain: ([x, y]) => {
            const clampedX = Math.max(Math.min(x, bInfo.domain[1]), bInfo.domain[0]);
            const clampedXLeft = Math.min(clampedX, pBall.x);
            const clampedXRight = Math.max(clampedX, pBall.x);
            if(pastMidPeriod){
                return [clampedXRight, pendPath(clampedXRight)];
            }else{
                return [clampedXLeft, pendPath(clampedXLeft)];
            }
        }
    });
    useEffect(() => {
        if(pBall.x === bInfo.domain[0]){
            setPastMidPeriod(true);
        }
        if(pBall.x === bInfo.domain[1]){
            setPastMidPeriod(false);
        }
    }, [pBall.x]);
    const angleRad = 3;
    const g = 9.8;
    const theta = Math.asin((pBall.x) / pendRad);
    const phi = Math.PI / 2 - theta;
    const weight = bInfo.mass * g;
    const velSqrtInside =  pendPath(bInfo.domain[1]) - pBall.y;
    const velocity = Math.sqrt(2 * g * velSqrtInside);
    const maxHeight = Math.abs(bInfo.start[1] - pendPath(bInfo.domain[1]));
    return(
        <div className="FBD-container">
            <Mafs width={dimensions.width} height={dimensions.height} pan={false} zoom={false} viewBox={{x: [-15, 15], y: [-15, 15]}}>
                <Circle
                    center={pBall.point}
                    radius={bInfo.rad}
                />
                <Line.Segment
                    point1={[0, 14]}
                    point2={[pBall.x - bInfo.rad * Math.cos(phi), pBall.y + bInfo.rad * Math.sin(phi)]}
                />
                <Plot.OfX
                    domain={bInfo.domain}
                    y={pendPath}
                    style="dashed"
                    color="gray"
                />
                <Vector
                    tail={pBall.point}
                    tip={[pBall.x, pBall.y - weight]}
                />
                {(pBall.x != bInfo.domain[0] && pBall.x != bInfo.domain[1]) && (
                    <Vector
                        tail={pBall.point}
                        tip={
                            pastMidPeriod ? 
                            [pBall.x + velocity * Math.cos(theta), pBall.y + velocity * Math.sin(theta)]
                            :
                            [pBall.x - velocity * Math.cos(theta), pBall.y - velocity * Math.sin(theta)]
                        }
                    />  
                )}
                <Line.Segment
                    point1={[0, 100]}
                    point2={[0, -100]}
                    style="dashed"
                    color="gray"
                />
                <Plot.Parametric
                    t={[-Math.PI / 2, -Math.PI / 2 + theta]}
                    xy={(t) => [angleRad * Math.cos(t), angleRad * Math.sin(t) + bInfo.pivot[1]]}
                />
                <Line.Segment
                    point1={[pBall.x - 1.5, pBall.y]}
                    point2={[pBall.x - 1.5, bInfo.start[1]]}
                    style="dashed"
                />
                <Line.Segment
                    point1={[pBall.x - 1.5 - 0.5, pBall.y]}
                    point2={[pBall.x - 1.5 + 0.5, pBall.y]}
                />
                <Line.Segment
                    point1={[pBall.x - 1.5 - 0.5, bInfo.start[1]]}
                    point2={[pBall.x - 1.5 + 0.5, bInfo.start[1]]}
                />
                {pBall.element}
            </Mafs>
        </div>
    );
}
export default WEPDPend