import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec, LaTeX } from "mafs";
import React, { act, useEffect, useRef, useState } from 'react';
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
    function latex(at, tex, color) {
        return (
            <LaTeX
                at={at}
                tex={String.raw`${tex}`}
                color={color}
            />
        );
    }
    const pInfo = {
        x: -12,
        y: 2,
        v: 14,
        theta: Math.PI / 3.2,
        g: 9.8,
        floorY: -5,
    }
    const velXI = pInfo.v * Math.cos(pInfo.theta);
    const velYI = pInfo.v * Math.sin(pInfo.theta);
    const timeInAir = (velYI + Math.sqrt(Math.pow(velYI, 2) + 2 * pInfo.g * (pInfo.y - pInfo.floorY))) / pInfo.g;
    const range = velXI * timeInAir;
    const projPath = (x) => Math.tan(pInfo.theta) * (x - pInfo.x) - (9.8 / (2 * Math.pow(pInfo.v * Math.cos(pInfo.theta), 2))) * Math.pow(x - pInfo.x, 2) + pInfo.y;
    const projBall = useMovablePoint([pInfo.x, pInfo.y], {
        constrain: ([x, y]) => {
            const clampedX = Math.max(Math.min(x, pInfo.x + range), pInfo.x);
            return [Math.max(clampedX, projBall.x), projPath(Math.max(clampedX, projBall.x))];
        }
    });
    const velocityVectorScaler = 0.35;
    //start of bar graph
    function createBar(leftX, rightX, bottom, top){
        const points = [[leftX, bottom], [rightX, bottom], [rightX, top], [leftX, top]];
        return points;
    }
    const xAxisY = -7;
    const graphHorizontalInc = 3.5;
    const graphHorizontalArr = [xAxisY + graphHorizontalInc, xAxisY + graphHorizontalInc * 2, xAxisY + graphHorizontalInc * 3, xAxisY + graphHorizontalInc * 4];
    const bars = {
        KX: -12,
        UX: 0,
        EX: 12,
        halfW: 2,
    }
    const mass = 0.0840067;
    const projVel = Math.sqrt(Math.pow(pInfo.v, 2) - 2 * 9.8 * Math.tan(pInfo.theta) * (projBall.point[0] - pInfo.x) + Math.pow(9.8 * (projBall.point[0] - pInfo.x) / velXI, 2));
    const KEnergy = 0.5 * mass * Math.pow(projVel, 2);
    const UEnergy = mass * 9.8 * (projBall.point[1] - pInfo.floorY);
    const TotalEnergy = KEnergy + UEnergy;

    const KBAr = createBar(bars.KX - bars.halfW, bars.KX + bars.halfW, xAxisY, KEnergy + xAxisY);
    const UBar = createBar(bars.UX - bars.halfW, bars.UX + bars.halfW, xAxisY, UEnergy + xAxisY);
    const EBar = createBar(bars.EX - bars.halfW, bars.EX + bars.halfW, xAxisY, TotalEnergy + xAxisY);
    return(
        <div className="FBD-container">
            <Mafs width={dimensions.width} height={dimensions.height} viewBox={{x: [-10, 10], y: [-10, 10]}} pan={false} zoom={false}>
                {/* setting */}
                <Line.Segment
                    point1={[pInfo.x, pInfo.floorY]}
                    point2={[100, pInfo.floorY]}
                />
                <Line.Segment
                    point1={[pInfo.x, pInfo.floorY]}
                    point2={[pInfo.x, pInfo.y]}
                />
                <Line.Segment
                    point1={[pInfo.x, pInfo.y]}
                    point2={[-100, pInfo.y]}
                />
                {/* setting */}
                <Plot.Parametric
                    t={[0, timeInAir]}
                    xy={(t) => [velXI * t + pInfo.x, velYI * t - 0.5 * pInfo.g * Math.pow(t, 2) + pInfo.y]}
                    style="dashed"
                    color="gray"
                />
                <Vector
                    tail={projBall.point}
                    tip={[projBall.point[0] + (velXI) * velocityVectorScaler, projBall.point[1] + (velYI - 9.8 * (projBall.point[0] - pInfo.x) / velXI) * velocityVectorScaler]}
                    color="violet"
                />
                <Line.Segment
                    point1={[projBall.x + 0.6, projBall.y]}
                    point2={[projBall.point[0] + 0.6, pInfo.floorY]}
                    style="dashed"
                    color="cyan"
                />
                <Line.Segment
                    point1={[projBall.x + 0.2, projBall.y]}
                    point2={[projBall.x + 1, projBall.y]}
                    color="cyan"
                />
                <Vector
                    tail={projBall.point}
                    tip={[projBall.x, projBall.y - 4]}
                />
                {latex(
                    [projBall.x, projBall.y - 5],
                    "F_g"
                )}
                {(projBall.point[1] > pInfo.floorY + 0.01) && (
                    latex(
                        [projBall.point[0] + 1,
                        (projBall.point[1] + pInfo.floorY) / 2],
                        "h",
                        "cyan"
                    )
                )}
                {latex(
                        [projBall.point[0] + (velXI) * velocityVectorScaler + 1, 
                        projBall.point[1] + (velYI - 9.8 * (projBall.point[0] - pInfo.x) / velXI) * velocityVectorScaler],
                        "v",
                        "violet"
                )}

                {projBall.element}
            </Mafs>
            <div className="diagramResetBtn">
                <button className="dashBtn" onClick={() => projBall.setPoint([pInfo.x, pInfo.y])}>reset</button>
            </div>
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
export default WEPDProj