import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec, LaTeX } from "mafs";
import React, { useEffect, useRef, useState } from 'react';
import Mather from './Mather';
import 'katex/dist/katex.min.css';

function WEPDRamp(){
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
    function distance(p1, p2) {
        return Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    }
    function createBar(leftX, rightX, bottom, top){
        const points = [[leftX, bottom], [rightX, bottom], [rightX, top], [leftX, top]];
        return points;
    }
    const rampPoints = [[-4, -2], [4, -2], [-4, 2]];
    const rampLine = (x) => -0.5 * x + 0.395;
    const rMass = useMovablePoint([-3.2, rampLine(-3.2)], {
        constrain: ([x, y]) => {
            const clapmedX = Math.max(Math.min(x, 4.5), -3.2);
            return [Math.max(clapmedX, rMass.x), Math.min(rampLine(clapmedX), rMass.y)];
        }
    });
    const halfSize = 0.25;
    const rMassPoints = [
        [rMass.x + halfSize - 0.1, rMass.y - halfSize - 0.2], 
        [rMass.x + halfSize + 0.2, rMass.y + halfSize - 0.1], 
        [rMass.x - halfSize + 0.1, rMass.y + halfSize + 0.2], 
        [rMass.x - halfSize - 0.2, rMass.y - halfSize + 0.1]
    ];
    const velScaler = 0.4;

    const mass = 0.5;
    const theta = Math.atan(1 / 2);
    const distFromStart = distance(rMass.point, [-3.2, rampLine(-3.2)]);
    const coeffFriction = 0.35;
    const frictionForce = mass * 9.8 * Math.cos(theta) * coeffFriction;
    const distFromFloor = Math.abs(rampLine(4.5) - rMass.y);
    const velocity = Math.sqrt(2 * 9.8 * distFromStart * (Math.sin(theta) - coeffFriction * Math.cos(theta)));

    const distIndicatorDist = 0.67;
    const distIndicatorSmall = 0.1;
    const indicatorLeft = [-3.2 - distIndicatorDist * Math.sin(theta), rampLine(-3.2) - distIndicatorDist * Math.cos(theta)];
    const indicatorRight = [rMass.x - distIndicatorDist * Math.sin(theta), rMass.y - distIndicatorDist * Math.cos(theta)];

    const realHalfSize = 0.35;
    const pointOfContact = [rMass.x - realHalfSize * Math.sin(theta), rMass.y - realHalfSize * Math.cos(theta)];
    const frictionEnd = [pointOfContact[0] - frictionForce * Math.cos(theta), pointOfContact[1] + frictionForce * Math.sin(theta)];
    const diagramVelX = velocity * Math.cos(theta) * velScaler;
    const diagramVelY = velocity * Math.sin(theta) * velScaler;
    const PEnergy = mass * 9.8 * distFromFloor;
    const KEnergy = 0.5 * mass * Math.pow(velocity, 2);
    const FWork = frictionForce * distFromStart;
    const MechEnergy = KEnergy + PEnergy;

    //bars
    const xAxisY = -7;
    const graphHorizontalInc = 3.5;
    const graphHorizontalArr = [xAxisY + graphHorizontalInc, xAxisY + graphHorizontalInc * 2, xAxisY + graphHorizontalInc * 3, xAxisY + graphHorizontalInc * 4];
    const bars = {
        KX: -12,
        UX: -4,
        EX: 12,
        FX: 4,
        halfW: 2,
    }
    const KBAr = createBar(bars.KX - bars.halfW, bars.KX + bars.halfW, xAxisY, 0.743 * KEnergy + xAxisY);
    const UBar = createBar(bars.UX - bars.halfW, bars.UX + bars.halfW, xAxisY, 0.743 * PEnergy + xAxisY);
    const FBar = createBar(bars.FX - bars.halfW, bars.FX + bars.halfW, xAxisY, 0.743 * FWork + xAxisY);
    const EBar = createBar(bars.EX - bars.halfW, bars.EX + bars.halfW, xAxisY, 0.743 * MechEnergy + xAxisY);
    return(
        <div className="FBD-container">
            <Mafs width={dimensions.width} height={dimensions.height} viewBox={{x: [-3, 3], y: [-3, 3]}}>
                <Polygon
                    points={rampPoints}
                />
                <Polygon
                    points={rMassPoints}
                />
                {(rMass.y > -1.85) && (
                    <>
                        {latex(
                            [rMass.x + 0.6,
                            (rMass.y - 2) / 2],
                            "h"
                        )}
                        <Line.Segment
                            point1={[rMass.x + 0.4, rMass.y]}
                            point2={[rMass.x + 0.4, -2]}
                            style="dashed"
                        />
                        <Line.Segment
                            point1={[rMass.x + 0.3, rMass.y]}
                            point2={[rMass.x + 0.5, rMass.y]}
                        />
                    </>
                )}
                {(rMass.x > -3.2) && (
                    <>
                        <Vector
                            tail={rMass.point}
                            tip={[rMass.x + diagramVelX, rMass.y - diagramVelY]}
                        />
                        {latex(
                            [rMass.x + diagramVelX + 0.2, rMass.y - diagramVelY - 0.1],
                            "v"
                        )}
                        {latex(
                            [(indicatorLeft[0] + indicatorRight[0]) / 2 - 2 * distIndicatorSmall * Math.sin(theta), (indicatorLeft[1] + indicatorRight[1]) / 2 - 2 * distIndicatorSmall * Math.cos(theta)],
                            "d"
                        )}
                    
                        <Line.Segment
                            point1={indicatorLeft}
                            point2={indicatorRight}
                            style="dashed"
                        />
                        <Line.Segment
                            point1={[indicatorLeft[0] - distIndicatorSmall * Math.sin(theta), indicatorLeft[1] - distIndicatorSmall * Math.cos(theta)]}
                            point2={[indicatorLeft[0] + distIndicatorSmall * Math.sin(theta), indicatorLeft[1] + distIndicatorSmall * Math.cos(theta)]}
                        />
                        <Line.Segment
                            point1={[indicatorRight[0] - distIndicatorSmall * Math.sin(theta), indicatorRight[1] - distIndicatorSmall * Math.cos(theta)]}
                            point2={[indicatorRight[0] + distIndicatorSmall * Math.sin(theta), indicatorRight[1] + distIndicatorSmall * Math.cos(theta)]}
                        />
                    </>
                )}
                <Vector
                    tail={pointOfContact}
                    tip={frictionEnd}
                />
                <Vector
                    tail={rMass.point}
                    tip={[rMass.x, rMass.y - mass * 3]}
                />
                {latex(
                    [rMass.x, rMass.y - mass * 3 - 0.3],
                    "F_g"
                )}
                {latex(
                    [frictionEnd[0] - 0.3, frictionEnd[1] + 0.15],
                    "F_f"
                )}

                {rMass.element}
            </Mafs>
            <div className="diagramResetBtn">
                <button className="dashBtn" onClick={() => rMass.setPoint([-3.2, rampLine(-3.2)])}>reset</button>
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
                                ((index + 1) * 25) + "J",
                                "white"
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
                        color="rgb(255, 255, 255)"
                        fillOpacity={1}
                    />
                    <Polygon
                        points={FBar}
                        color="rgb(150, 105, 255)"
                        fillOpacity={1}
                    />
                    {latex(
                        [bars.KX, xAxisY - 2],
                        "K"
                    )}
                    {latex(
                        [bars.UX, xAxisY - 2],
                        "U"
                    )}
                    {latex(
                        [bars.FX, xAxisY - 2],
                        "W_f"
                    )}
                    {latex(
                        [bars.EX, xAxisY - 2],
                        "E"
                    )}
                </Mafs>
            </div>
        </div>
    );
}
export default WEPDRamp