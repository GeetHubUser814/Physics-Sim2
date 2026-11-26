import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec, LaTeX } from "mafs";
import React, { useEffect, useRef, useState } from 'react';
import Mather from './Mather';
import 'katex/dist/katex.min.css';
import { binrelClass } from "katex/src/functions/mclass.js";

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
    function latex(at, tex, color) {
        return (
            <LaTeX
                at={at}
                tex={String.raw`${tex}`}
                color={color}
            />
        );
    }
    function createBar(leftX, rightX, bottom, top){
        const points = [[leftX, bottom], [rightX, bottom], [rightX, top], [leftX, top]];
        return points;
    }
    const bInfo = {
        start: [0, -6],
        rad: 1,
        domain: [-12, 12],
        pivot: [0, 14],
        mass: 0.3567
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
    const maxTheta = Math.asin(bInfo.domain[1] / pendRad);
    const phi = Math.PI / 2 - theta;
    const diagramWeightMultiplyer = 2;
    const weight = bInfo.mass * g * diagramWeightMultiplyer;
    const velSqrtInside =  pendPath(bInfo.domain[1]) - pBall.y;
    const velocity = Math.sqrt(2 * g * velSqrtInside);
    const maxHeight = Math.abs(bInfo.start[1] - pendPath(bInfo.domain[1]));

    const xAxisY = -7;
    const graphHorizontalInc = 3.5;
    const graphHorizontalArr = [xAxisY + graphHorizontalInc, xAxisY + graphHorizontalInc * 2, xAxisY + graphHorizontalInc * 3, xAxisY + graphHorizontalInc * 4];
    const bars = {
        KX: -12,
        UX: 0,
        EX: 12,
        halfW: 2,
    }
    const KEnergy = 0.5 * bInfo.mass * Math.pow(velocity, 2);
    const UEnergy = bInfo.mass * 9.8 * (pBall.y - bInfo.start[1]);
    const TotalEnergy = KEnergy + UEnergy;

    const KBAr = createBar(bars.KX - bars.halfW, bars.KX + bars.halfW, xAxisY, KEnergy + xAxisY);
    const UBar = createBar(bars.UX - bars.halfW, bars.UX + bars.halfW, xAxisY, UEnergy + xAxisY);
    const EBar = createBar(bars.EX - bars.halfW, bars.EX + bars.halfW, xAxisY, TotalEnergy + xAxisY);

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
                <Line.Segment
                    point1={[bInfo.domain[0] + Math.sin(maxTheta), pendPath(bInfo.domain[0]) + Math.cos(maxTheta)]}
                    point2={[bInfo.domain[0] - Math.sin(maxTheta), pendPath(bInfo.domain[0]) - Math.cos(maxTheta)]}
                    color="gray"
                />
                <Line.Segment
                    point1={[bInfo.domain[1] + Math.sin(-maxTheta), pendPath(bInfo.domain[1]) + Math.cos(-maxTheta)]}
                    point2={[bInfo.domain[1] - Math.sin(-maxTheta), pendPath(bInfo.domain[1]) - Math.cos(-maxTheta)]}
                    color="gray"
                />
                <Vector
                    tail={pBall.point}
                    tip={[pBall.x, pBall.y - weight]}
                    color="cyan"
                />
                {latex(
                    [pBall.x, pBall.y - weight - 1.4],
                    "F_g",
                    "cyan"
                )}
                {(pBall.y >= bInfo.start[1] + 0.05) && (
                    <>
                        <Line.Segment
                            point1={[pBall.x - 1.5, pBall.y]}
                            point2={[pBall.x - 1.5, bInfo.start[1]]}
                            style="dashed"
                            color="cyan"
                        />
                        <Line.Segment
                            point1={[pBall.x - 1.5 - 0.5, pBall.y]}
                            point2={[pBall.x - 1.5 + 0.5, pBall.y]}
                            color="cyan"
                        />
                        <Line.Segment
                            point1={[pBall.x - 1.5 - 0.5, bInfo.start[1]]}
                            point2={[pBall.x - 1.5 + 0.5, bInfo.start[1]]}
                            color="cyan"
                        />
                        {latex(
                            [pBall.x - 2.5, (pBall.y + bInfo.start[1]) / 2],
                            "h",
                            "cyan"
                        )}
                    </>
                )}
                {(pBall.x != bInfo.domain[0] && pBall.x != bInfo.domain[1]) && (
                    <>
                        <Vector
                            tail={pBall.point}
                            tip={
                                pastMidPeriod ? 
                                [pBall.x + velocity * Math.cos(theta), pBall.y + velocity * Math.sin(theta)]
                                :
                                [pBall.x - velocity * Math.cos(theta), pBall.y - velocity * Math.sin(theta)]
                            }
                            color="violet"
                        />
                        {latex(
                            [
                                pastMidPeriod ? pBall.x + (velocity + 1) * Math.cos(theta) : pBall.x - (velocity + 1) * Math.cos(theta),
                                pastMidPeriod ? pBall.y + (velocity + 1) * Math.sin(theta) : pBall.y - (velocity + 1) * Math.sin(theta)
                            ],
                            "v",
                            "violet"
                        )}
                    </>
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
                {(Math.abs(theta) > 0.03) && (
                    latex(
                        [bInfo.pivot[0] + (angleRad + 1) / 2 * Math.sin(theta), bInfo.pivot[1] - (angleRad + 1)],
                        "θ"
                    )
                )}
                {pBall.element}
            </Mafs>
            <div className="eDiagramContainer">
                <Mafs width={dimensions.width * 0.45} height={dimensions.height * 0.55} viewBox={{x: [-10, 10], y: [-10, 10]}}>
                    <Line.Segment
                        point1={[-19, xAxisY]}
                        point2={[20, xAxisY]}
                    />
                    {latex(
                        [-21, xAxisY],
                        "0J"
                    )}
                    {graphHorizontalArr.map((y, index) => (
                        <>
                            <Line.Segment
                                key={index}
                                point1={[-19, y]}
                                point2={[20, y]}
                                color="gray"
                            />
                            {latex(
                                [-21, y],
                                ((index + 1) * 25) + "J"
                            )}
                        </>

                    ))}
                    <Polygon
                        points={KBAr}
                        color="violet"
                        fillOpacity={1}
                    />
                    <Polygon
                        points={UBar}
                        color="cyan"
                        fillOpacity={1}
                    />
                    <Polygon
                        points={EBar}
                        color="rgb(150, 105, 255)"
                        fillOpacity={1}
                    />
                    {latex(
                        [-12, xAxisY - 2],
                        "K"
                    )}
                    {latex(
                        [0, xAxisY - 2],
                        "U"
                    )}
                    {latex(
                        [12, xAxisY - 2],
                        "E"
                    )}
                </Mafs>
            </div>
        </div>
    );
}
export default WEPDPend