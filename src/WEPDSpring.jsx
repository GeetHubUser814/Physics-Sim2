import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec, LaTeX } from "mafs";
import React, { useEffect, useRef, useState } from 'react';
import Mather from './Mather';
import 'katex/dist/katex.min.css';

function WEPDSpring() {
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
    function createRectangle(center, width, height) {
        const points = [
            [center[0] - width / 2, center[1] + height / 2],
            [center[0] + width / 2, center[1] + height / 2],
            [center[0] + width / 2, center[1] - height / 2],
            [center[0] - width / 2, center[1] - height / 2]
        ];
        return points;
    }
    function createBar(leftX, rightX, bottom, top) {
        const points = [[leftX, bottom], [rightX, bottom], [rightX, top], [leftX, top]];
        return points;
    }
    function latex(at, tex, color) {
        return (
            <LaTeX
                at={at}
                tex={String.raw`${tex}`}
                color={color}
            />
        );
    }
    const setting = {
        floorL: [-17, -5],
        floorR: [100, -5],
        wallTop: [-17, 3],
        wallTopL: [-100, 3]
    };
    const [massInfo, setMassInfo] = useState({
        maxLeft: -12,
        maxRight: 17,
        side: 3,
        massY: -3.5,
    });
    const equilibrium = (massInfo.maxLeft + massInfo.maxRight) / 2;
    const maxDistInitial = 14.5;
    const [pastMidPeriod, setPastMidPeriod] = useState(false);
    const [prevX, setPrevX] = useState(massInfo.maxRight);
    const mass = useMovablePoint([massInfo.maxRight, massInfo.massY], {
        constrain: ([x, y]) => {
            const clampedX = Math.max(Math.min(x, massInfo.maxRight), massInfo.maxLeft);
            setDistance((prev) => (prev + Math.abs(mass.x - prevX)));
            setPrevX(mass.x);
            if (mass.x <= massInfo.maxLeft) {
                setPastMidPeriod(true);
            }
            if (mass.x >= massInfo.maxRight) {
                setPastMidPeriod(false);
            }
            if (pastMidPeriod) {
                return [Math.max(clampedX, mass.x), massInfo.massY];
            } else {
                return [Math.min(clampedX, mass.x), massInfo.massY];
            }

        }
    })
    const massPts = createRectangle(mass.point, massInfo.side, massInfo.side);
    const springHAxis = massInfo.massY;
    const coilDenominator = 14;
    const increment = Math.abs(mass.x - massInfo.side / 2 + 17) / coilDenominator;
    const springRad = 1;
    const springStartX = setting.floorL[0];

    const posMarkerInfo = {
        top: 3,
        bottom: -5,
    };
    const posMarkers = [
        [[massInfo.maxLeft, posMarkerInfo.bottom], [massInfo.maxLeft, posMarkerInfo.top]],
        [[equilibrium, posMarkerInfo.bottom], [equilibrium, posMarkerInfo.top]],
        [[massInfo.maxRight, posMarkerInfo.bottom], [massInfo.maxRight, posMarkerInfo.top]]
    ];
    const massValue = 1;
    const maxDisplacement = massInfo.maxRight - equilibrium;
    const displacement = mass.x - equilibrium;
    const springConst = 100;

    const [distance, setDistance] = useState(0);
    const coeffFriction = 1;
    const frictionForce = massValue * 9.8 * coeffFriction;
    const frictionWork = frictionForce * distance;

    const velocitySqrtInside = (springConst * (Math.pow(maxDisplacement, 2) - Math.pow(displacement, 2))) / massValue;
    const velocity = Math.sqrt((velocitySqrtInside < 0 ? 0 : velocitySqrtInside));
    const diagramVelocity = velocity * 0.2;

    useEffect(() => {
        const sqrtInside = (Math.pow(maxDistInitial, 2) - 2 * frictionWork / springConst) > 0 ? Math.pow(maxDistInitial, 2) - 2 * frictionWork / springConst : 0;
        setMassInfo((prev) => ({
            ...prev,
            maxLeft: equilibrium - Math.sqrt(sqrtInside),
            maxRight: equilibrium + Math.sqrt(sqrtInside)
        }));
    }, [frictionWork]);

    function reset() {
        setPastMidPeriod(false);
        setDistance(0);
        setPrevX(equilibrium + maxDistInitial);
        setMassInfo((prev) => ({
            ...prev,
            maxLeft: -12,
            maxRight: 17,
        }));
        mass.setPoint([equilibrium + maxDistInitial, massInfo.massY]);
        setIsStopped(false);
    }
    const PEnergy = 0.5 * springConst * Math.pow(displacement, 2);
    const KEnergy = 0.5 * massValue * Math.pow(velocity, 2);
    const MechEnergy = KEnergy + PEnergy;
    //bars
    const purpleColor = "rgb(159, 118, 255)";
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
    const barScaler = 0.00067 * 2;
    const KBar = createBar(bars.KX - bars.halfW, bars.KX + bars.halfW, xAxisY, barScaler * KEnergy + xAxisY);
    const UBar = createBar(bars.UX - bars.halfW, bars.UX + bars.halfW, xAxisY, barScaler * PEnergy + xAxisY);
    const FBar = createBar(bars.FX - bars.halfW, bars.FX + bars.halfW, xAxisY, barScaler * frictionWork + xAxisY);
    const EBar = createBar(bars.EX - bars.halfW, bars.EX + bars.halfW, xAxisY, barScaler * MechEnergy + xAxisY);

    const [isStopped, setIsStopped] = useState(false);
    useEffect(() => {
        if (massInfo.maxRight <= (equilibrium + 0.4)) {
            setIsStopped(true);
        }
    }, [massInfo.maxRight]);
    return (
        <div className="FBD-container">

            <Mafs width={dimensions.width} height={dimensions.height} viewBox={{ x: [-10, 10], y: [-10, 10] }} pan={false} zoom={false}>

                <Line.Segment
                    point1={setting.floorL}
                    point2={setting.floorR}
                />
                <Line.Segment
                    point1={setting.floorL}
                    point2={setting.wallTop}
                />
                <Line.Segment
                    point1={setting.wallTop}
                    point2={setting.wallTopL}
                />
                <Polygon
                    points={massPts}
                />
                {(!isStopped) && (
                    posMarkers.map((value, index) => (
                        <Line.Segment
                            point1={value[0]}
                            point2={value[1]}
                            style="dashed"
                            key={index}
                        />
                    ))
                )}
                <Vector
                    tail={[equilibrium, -6]}
                    tip={[mass.x, -6]}
                    color="cyan"
                />
                {latex(
                    [(equilibrium + mass.x) / 2, -7],
                    "Δx",
                    "cyan"
                )}
                {/* actual spring */}
                <Line.Segment
                    point1={[springStartX, springHAxis]}
                    point2={[springStartX + increment, springHAxis + springRad]}
                />
                <Line.Segment
                    point1={[springStartX + increment, springHAxis + springRad]}
                    point2={[springStartX + 3 * increment, springHAxis - springRad]}
                />
                <Line.Segment
                    point1={[springStartX + 3 * increment, springHAxis - springRad]}
                    point2={[springStartX + 5 * increment, springHAxis + springRad]}
                />
                <Line.Segment
                    point1={[springStartX + 5 * increment, springHAxis + springRad]}
                    point2={[springStartX + 7 * increment, springHAxis - springRad]}
                />
                <Line.Segment
                    point1={[springStartX + 7 * increment, springHAxis - springRad]}
                    point2={[springStartX + 9 * increment, springHAxis + springRad]}
                />
                <Line.Segment
                    point1={[springStartX + 9 * increment, springHAxis + springRad]}
                    point2={[springStartX + 11 * increment, springHAxis - springRad]}
                />
                <Line.Segment
                    point1={[springStartX + 11 * increment, springHAxis - springRad]}
                    point2={[springStartX + 13 * increment, springHAxis + springRad]}
                />
                <Line.Segment
                    point1={[springStartX + 13 * increment, springHAxis + springRad]}
                    point2={[springStartX + 14 * increment, springHAxis]}
                />
                {/* actual spring */}
                {(mass.x > (massInfo.maxLeft + 0.00001) && mass.x < (massInfo.maxRight - 0.00001)) && (
                    <>
                        <Vector
                            tail={mass.point}
                            tip={[mass.x + diagramVelocity * (pastMidPeriod ? 1 : -1), mass.y]}
                            color="violet"
                        />
                        {latex(
                            [mass.x + (diagramVelocity + 0.7) * (pastMidPeriod ? 1 : -1), mass.y],
                            "v",
                            "violet"
                        )}
                        <Vector
                            tail={[mass.x, mass.y - 1.5]}
                            tip={[mass.x + frictionForce * (pastMidPeriod ? -1 : 1), mass.y - 1.5]}
                            color={purpleColor}
                        />
                        {latex(
                            [mass.x + (frictionForce + 0.7) * (pastMidPeriod ? -1 : 1), mass.y - 1],
                            "F_f",
                            purpleColor
                        )}
                    </>
                )}
                <Vector
                    tail={mass.point}
                    tip={[mass.x, mass.y - 5]}
                    color={purpleColor}
                />
                {latex(
                    [mass.x, mass.y - 6],
                    "F_g",
                    purpleColor
                )}
                {mass.element}
            </Mafs>

            <div className="diagramResetBtn">
                <button className="dashBtn" onClick={() => {
                    reset()
                }}>reset</button>
            </div>
            <div className="eDiagramContainer">
                <Mafs width={dimensions.width * 0.45} height={dimensions.height * 0.55} viewBox={{ x: [-10, 10], y: [-10, 10] }}>
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
                        points={KBar}
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
                        color={purpleColor}
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
export default WEPDSpring