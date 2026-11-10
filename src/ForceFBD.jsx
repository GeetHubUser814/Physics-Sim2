import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec } from "mafs";
import React, { useEffect, useRef, useState } from 'react';
import Mather from './Mather';

function ForceFBD({ show }) {

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

    function distance(p1, p2) {
        return Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    }
    //ramp start
    const rampHeight = 2;
    const rampWidth = 1;
    const rampTop = useMovablePoint([-3, rampHeight], {
        constrain: ([x, y]) => [-3, Math.max(-3, y)]
    });
    const gravEnd = useMovablePoint([(-3 + rampWidth) / 2 + 0.12, -2], {
        constrain: ([x, y]) => [(-3 + rampWidth) / 2 + 0.12, Math.min((rampTop.y / 2) - 1.3, y)]
    });
    const ramp = {
        rad: 0.2,
        centerX: (-3 + rampWidth) / 2 + 0.12,
        centerY: (rampTop.y / 2) - 1.3,
        b: [-3, -3],
        c: [rampWidth, -3],
        theta: Math.atan2((rampTop.y) + 3, (rampWidth) + 3) * 180 / Math.PI,
        thetaRads: Math.atan2((rampTop.y) + 3, (rampWidth) + 3)
    };
    const pointOfContact = [ramp.centerX - ramp.rad * Math.sin(ramp.thetaRads), ramp.centerY - ramp.rad * Math.cos(ramp.thetaRads)];
    const gravMagnitude = distance([ramp.centerX, ramp.centerY], gravEnd.point);
    const gravNormal = [ramp.centerX - gravMagnitude * Math.sin(2 * ramp.thetaRads) / 2,
    ramp.centerY - gravMagnitude * Math.pow(Math.cos(ramp.thetaRads), 2)];
    const gravNormalReal = [pointOfContact[0] + gravMagnitude * Math.sin(2 * ramp.thetaRads) / 2,
    pointOfContact[1] + gravMagnitude * Math.pow(Math.cos(ramp.thetaRads), 2)];
    const gravTangent = [ramp.centerX + gravMagnitude * Math.sin(2 * ramp.thetaRads) / 2,
    ramp.centerY - gravMagnitude * Math.pow(Math.sin(ramp.thetaRads), 2)];
    const normalMagnitude = distance([ramp.centerX, ramp.centerY], gravNormal);
    const tangentMagnitude = distance(gravEnd.point, gravTangent);
    const [coeffOfFriction, setCoeffOfFriction] = useState(0.5);
    const [coeffOfFrictionTemp, setCoeffOfFrictionTemp] = useState(0.5);
    const frictionMagnitude = normalMagnitude * coeffOfFriction;
    const frictionTip = [pointOfContact[0] - frictionMagnitude * Math.cos(ramp.thetaRads), pointOfContact[1] + frictionMagnitude * Math.sin(ramp.thetaRads)];
    //ramp end

    //atwood start
    const atwood = {
        pulleyRad: 0.7,
        pulleyCenterX: 0,
        pulleyCenterY: 2,
        length: -3
    }
    const masses = {
        mass1Pos: [atwood.pulleyCenterX - atwood.pulleyRad, atwood.pulleyCenterY + atwood.length / 1.13],
        mass2Pos: [atwood.pulleyCenterX + atwood.pulleyRad, atwood.pulleyCenterY + atwood.length / 1.13],
    }
    const squareSize = 0.8;
    const massesPoints = {
        mass1TopLeft: [masses.mass1Pos[0] - squareSize / 2, masses.mass1Pos[1] + squareSize / 2],
        mass2TopLeft: [masses.mass2Pos[0] - squareSize / 2, masses.mass2Pos[1] + squareSize / 2],
        mass1BottomRight: [masses.mass1Pos[0] + squareSize / 2, masses.mass1Pos[1] - squareSize / 2],
        mass2BottomRight: [masses.mass2Pos[0] + squareSize / 2, masses.mass2Pos[1] - squareSize / 2],
        mass1TopRight: [masses.mass1Pos[0] + squareSize / 2, masses.mass1Pos[1] + squareSize / 2],
        mass2TopRight: [masses.mass2Pos[0] + squareSize / 2, masses.mass2Pos[1] + squareSize / 2],
        mass1BottomLeft: [masses.mass1Pos[0] - squareSize / 2, masses.mass1Pos[1] - squareSize / 2],
        mass2BottomLeft: [masses.mass2Pos[0] - squareSize / 2, masses.mass2Pos[1] - squareSize / 2]
    }
    const mass1GravEnd = useMovablePoint([masses.mass1Pos[0], masses.mass1Pos[1] - 1], {
        constrain: ([x, y]) => [masses.mass1Pos[0], Math.min(masses.mass1Pos[1] - squareSize / 2, y)]
    });
    const mass2GravEnd = useMovablePoint([masses.mass2Pos[0], masses.mass2Pos[1] - 1], {
        constrain: ([x, y]) => [masses.mass2Pos[0], Math.min(masses.mass2Pos[1] - squareSize / 2, y)]
    });
    const mass1Weight = distance(masses.mass1Pos, mass1GravEnd.point) * 10;
    const mass2Weight = distance(masses.mass2Pos, mass2GravEnd.point) * 10;
    const tensionMagnitude = 2 / 10 * (mass1Weight * mass2Weight) / (mass1Weight + mass2Weight);
    const mass1NetForce = Math.abs(mass1Weight - tensionMagnitude * 10);
    const mass2NetForce = Math.abs(mass2Weight - tensionMagnitude * 10);
    //atwood end

    //spring start
    const [springIsHorizontal, setSpringIsHorizontal] = useState(null);
    const springMassCenter = useMovablePoint([0, -1], {
        constrain: ([x, y]) => [Math.max(Math.min(x, 7.5), -7.5), -1],
    });
    const spring = {
        massSize: 2,
        vsMassSize: 0.8
    };
    const springMassPoints = createRectangle(springMassCenter.point, spring.massSize, spring.massSize);
    const [springConst, setSpringConst] = useState(100);
    const [springConstTemp, setSpringConstTemp] = useState(100);
    const [maxDisplacement, setMaxDisplacement] = useState(2);
    const [maxDisplacementTemp, setMaxDisplacementTemp] = useState(2);
    const isMassPosRight = springMassCenter.point[0] > 0;
    const displacement = (isMassPosRight ? 1 : -1) * distance(springMassCenter.point, [0, -1]) * (maxDisplacement / 7.5);
    const springForce = -springConst * displacement;
    //actual spring
    const wallMassDist = distance([springMassCenter.point[0] - spring.massSize / 2, 0], [-10, 0]);
    const springHAxis = springMassCenter.point[1];
    const springRad = 0.6;
    const coilDenominator = 14;
    const increment = wallMassDist / (coilDenominator);

    const vsMassCenter = useMovablePoint([0, -1], {
        constrain: ([x, y]) => [0, Math.max(Math.min(y, 2), -4)],
    });
    const vsMassCenterX = vsMassCenter.point[0];
    const vsMassCenterY = vsMassCenter.point[1];
    const vsMassPoints = createRectangle(vsMassCenter.point, spring.vsMassSize, spring.vsMassSize);
    const [vsWeight, setVsWeight] = useState(50);
    const [vsWeightTemp, setVsWeightTemp] = useState(50);
    const vsEquillibriumDistFromRest = vsWeight / springConst;
    const vsUnitDispFromEq = (vsMassCenterY + 1) / 3
    const vsDispFromEq = vsUnitDispFromEq * maxDisplacement;
    const vsDispFromRest = vsEquillibriumDistFromRest - vsDispFromEq;
    const vsIsMassPosAboveRest = vsDispFromRest < 0;
    const vsDisplayedSpringForce = 2 * (vsDispFromRest / vsEquillibriumDistFromRest);
    const vsSpringForce = -springConst * vsDispFromRest;
    const vsNetForce = -vsWeight - vsSpringForce;
    const springForceTip = vsMassCenterY + (vsIsMassPosAboveRest ? -1 : 1) * spring.vsMassSize / 2 + vsDisplayedSpringForce;
    //actual spring
    const vsCeilingMassDist = distance([0, vsMassCenterY + spring.vsMassSize / 2], [0, 3]);
    const vsRad = 0.6;
    const vsCoilDenominator = 16;
    const vsIncrement = vsCeilingMassDist / (vsCoilDenominator);
    //spring end


    //elevator start
    const elevator = {
        centerX: 0,
        centerY: 0,
        massCenterX: 0,
        massCenterY: -2
    };
    const elevatorPoints = createRectangle([elevator.centerX, elevator.centerY], 4.5, 5);
    const objectPoints = createRectangle([elevator.massCenterX, elevator.massCenterY], 1, 1);
    const objectPointsCeiling = createRectangle([elevator.massCenterX, elevator.massCenterY + 4], 1, 1)
    const [eGrav, setEGrav] = useState(9.8);
    const [eGravTemp, setEGravTemp] = useState(9.8);
    const [eMass, setEMass] = useState(5);
    const [eMassTemp, setEMassTemp] = useState(5);
    const eWeight = eMass * eGrav;
    const eDisplayedWeight = eWeight / 10;
    const eWeightVectorEnd = elevator.massCenterY - eDisplayedWeight / 2;
    const eAccelerationEnd = useMovablePoint([5, 2], {
        constrain: ([x, y]) => [5, Math.min(10, Math.max(-10, y))]
    });
    const eIsAcceleratingUp = eAccelerationEnd.point[1] > 0;
    const eDisplayedAcceleration = distance([5, 0], eAccelerationEnd.point) * (eIsAcceleratingUp ? 1 : -1) * 2;
    const eNormalForce = eMass * (eDisplayedAcceleration + eGrav);
    const eDisplayedNormalForce = eNormalForce / 20;
    const eNetForce = eNormalForce - eWeight;
    const isNotPastFreeFall = eDisplayedAcceleration >= -eGrav;
    //elevator end

    //circ start
    const [circCar, setCircCar] = useState(null);
    const carCenter = useMovablePoint([0, 8.25], {
        constrain: ([x, y]) => {
            const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            const rad = 8.25;
            const distFromCirc = dist - rad;
            const cos = x / dist;
            const sin = y / dist;
            return [
                x - distFromCirc * cos,
                y - distFromCirc * sin
            ]
        }
    });

    //circ end
    function createRectangle(center, width, height) {
        const points = [
            [center[0] - width / 2, center[1] + height / 2],
            [center[0] + width / 2, center[1] + height / 2],
            [center[0] + width / 2, center[1] - height / 2],
            [center[0] - width / 2, center[1] - height / 2]
        ];
        return points;
    }
    function createForm(submit, text, val, change, min, max, stepNum) {
        return (
            <div className="FBD-info-sub">
                <form onSubmit={submit}>
                    <label>
                        {text}
                        <input
                            type="number"
                            value={val}
                            onChange={change}
                            min={min}
                            max={max}
                            step={stepNum}
                        />
                    </label>
                </form>
            </div>
        );
    }

    return (
        <div className="bigForceFBDContainer">
            {show === "isRamp" && (
                <div className="FBD-container">
                    <Mafs pan={false} zoom={false} width={dimensions.width} height={dimensions.height} viewBox={{ x: [-5, 5], y: [gravEnd.point[1] - 2, Math.max(rampTop.point[1] + 2, gravNormalReal[1] + 2)] }}>

                        <Circle
                            center={[ramp.centerX, ramp.centerY]}
                            radius={ramp.rad}

                        />
                        <Polygon
                            points={[rampTop.point, ramp.b, ramp.c]}
                            color="gray"
                        />
                        {/* gravity */}
                        <Vector
                            tail={[ramp.centerX, ramp.centerY]}
                            tip={gravEnd.point}
                        />
                        <Text
                            x={gravEnd.point[0]}
                            y={gravEnd.point[1] - 0.6 - gravMagnitude * 0.1}
                        >
                            G
                        </Text>
                        <Vector
                            tail={pointOfContact}
                            tip={gravNormal}
                            color="gray"
                            style="dashed"
                        />
                        <Vector
                            tail={[ramp.centerX, ramp.centerY]}
                            tip={gravTangent}
                            color="gray"
                            style="dashed"
                        />
                        <Vector
                            tail={pointOfContact}
                            tip={gravNormalReal}
                        />
                        <Text
                            x={gravNormalReal[0] + 0.3 + distance(pointOfContact, gravNormalReal) * 0.1}
                            y={gravNormalReal[1] + 0.3 + distance(pointOfContact, gravNormalReal) * 0.1}
                        >
                            N
                        </Text>
                        <Text
                            x={frictionTip[0] - 0.3 - distance(pointOfContact, frictionTip) * 0.1}
                            y={frictionTip[1] + 0.3 + distance(pointOfContact, frictionTip) * 0.1}
                        >
                            f
                        </Text>
                        {(coeffOfFriction > 0) && (
                            <Vector
                                tail={pointOfContact}
                                tip={frictionTip}
                            />
                        )}
                        {gravEnd.element}

                        {rampTop.element}

                    </Mafs>
                    <div className="FBD-info">
                        <p className="FBD-info-sub">theta: {ramp.theta.toFixed(3)}</p>
                        <p className="FBD-info-sub">weight: {gravMagnitude.toFixed(3)}</p>
                        {createForm(
                            (e) => {
                                e.preventDefault();
                                setCoeffOfFriction(coeffOfFrictionTemp);
                            }
                            , "coefficient of friction (0-1.5):", coeffOfFrictionTemp, (e) => setCoeffOfFrictionTemp(parseFloat(e.target.value)), 0, 1.5, 0.1
                        )}
                        <p className="FBD-info-sub FBD-info-normal">normal force: {normalMagnitude.toFixed(3)}</p>
                        <p className="FBD-info-sub FBD-info-normal">parallel component of gravity: {tangentMagnitude.toFixed(3)}</p>
                        <p className="FBD-info-sub FBD-info-normal">friction: {frictionMagnitude.toFixed(3)}</p>
                    </div>
                </div>
            )}
            {show === "isAtwood" && (
                <div className="FBD-container">
                    <Mafs pan={false} zoom={false} width={dimensions.width} height={dimensions.height} viewBox={{ x: [-5, 5], y: [Math.min(mass1GravEnd.point[1] - 1, mass2GravEnd.point[1]) - 1, Math.max(masses.mass1Pos[1] + tensionMagnitude + 2, atwood.pulleyCenterY + atwood.pulleyRad)] }}>
                        {/*pulley*/}
                        <Circle
                            center={[atwood.pulleyCenterX, atwood.pulleyCenterY]}
                            radius={atwood.pulleyRad}
                            color="gray"
                        />
                        {/*mass1*/}
                        <Polygon
                            points={[massesPoints.mass1TopLeft, massesPoints.mass1TopRight, massesPoints.mass1BottomRight, massesPoints.mass1BottomLeft]}
                        />
                        {/*mass2*/}
                        <Polygon
                            points={[massesPoints.mass2TopLeft, massesPoints.mass2TopRight, massesPoints.mass2BottomRight, massesPoints.mass2BottomLeft]}
                        />
                        <Line.Segment
                            point1={[atwood.pulleyCenterX - atwood.pulleyRad, atwood.pulleyCenterY]}
                            point2={[atwood.pulleyCenterX - atwood.pulleyRad, atwood.pulleyCenterY * (1.4) + atwood.length]}
                            color="gray"
                        />
                        <Line.Segment
                            point1={[atwood.pulleyCenterX + atwood.pulleyRad, atwood.pulleyCenterY]}
                            point2={[atwood.pulleyCenterX + atwood.pulleyRad, atwood.pulleyCenterY * (1.4) + atwood.length]}
                            color="gray"
                        />
                        <Vector
                            tail={masses.mass1Pos}
                            tip={mass1GravEnd.point}
                        />
                        <Vector
                            tail={masses.mass2Pos}
                            tip={mass2GravEnd.point}
                        />
                        <Vector
                            tail={[masses.mass1Pos[0], masses.mass1Pos[1] + squareSize / 2]}
                            tip={[masses.mass1Pos[0], masses.mass1Pos[1] + squareSize / 2 + tensionMagnitude]}
                        />
                        <Vector
                            tail={[masses.mass2Pos[0], masses.mass2Pos[1] + squareSize / 2]}
                            tip={[masses.mass2Pos[0], masses.mass2Pos[1] + squareSize / 2 + tensionMagnitude]}
                        />
                        <Text
                            x={masses.mass1Pos[0] - 1}
                            y={masses.mass1Pos[1]}
                            size={15}
                        >m1</Text>
                        <Text
                            x={masses.mass2Pos[0] + 1}
                            y={masses.mass2Pos[1]}
                            size={15}
                        >m2</Text>
                        <Text
                            x={masses.mass1Pos[0] - 0.7}
                            y={masses.mass2Pos[1] + squareSize / 2 + tensionMagnitude}
                            size={20}
                        >
                            T
                        </Text>
                        <Text
                            x={masses.mass2Pos[0] + 0.7}
                            y={masses.mass2Pos[1] + squareSize / 2 + tensionMagnitude}
                            size={20}
                        >
                            T
                        </Text>
                        <Text
                            x={masses.mass1Pos[0] - 0.7}
                            y={mass1GravEnd.point[1]}
                            size={20}
                        >
                            G
                        </Text>
                        <Text
                            x={masses.mass2Pos[0] + 0.7}
                            y={mass2GravEnd.point[1]}
                            size={20}
                        >
                            G
                        </Text>
                        {mass1GravEnd.element}
                        {mass2GravEnd.element}
                    </Mafs>
                    <div className="FBD-info">
                        <p className="FBD-info-sub ">weight of mass 1: {mass1Weight.toFixed(3)}</p>
                        <p className="FBD-info-sub">weight of mass 2: {mass2Weight.toFixed(3)}</p>
                        <p className="FBD-info-sub FBD-info-normal">tension in the rope: {(tensionMagnitude * 10).toFixed(3)}</p>
                        <p className="FBD-info-sub FBD-info-normal">magnitude of net force on mass 1: {mass1NetForce.toFixed(3)}</p>
                        <p className="FBD-info-sub FBD-info-normal">magnitude of net force on mass 2: {mass2NetForce.toFixed(3)}</p>
                    </div>
                </div>
            )}
            {(show === "isSpring") && (
                <div className="I-DO-NOTHING">
                    <div className="I-DO-NOTHING">
                        <div className="containerForm">
                            {(springIsHorizontal === null) && (
                                <div className="spring-options">
                                    <button className="dashBtn" onClick={() => setSpringIsHorizontal(true)}>
                                        horizontal spring
                                    </button>
                                    <button className="dashBtn" onClick={() => setSpringIsHorizontal(false)}>
                                        vertical spring
                                    </button>
                                </div>
                            )}
                        </div>
                        {(springIsHorizontal) && (
                            <div className="FBD-container">
                                <Mafs pan={false} zoom={false} width={dimensions.width} height={dimensions.height} viewBox={{ x: [-12, 12], y: [-5.5, 5] }}>
                                    {/*floor and wall*/}
                                    <Line.Segment
                                        point1={[-10, -2]}
                                        point2={[100000, -2]}
                                    />
                                    <Line.Segment
                                        point1={[-10, -2]}
                                        point2={[-10, 2]}
                                    />
                                    <Line.Segment
                                        point1={[-10, 2]}
                                        point2={[-10000, 2]}
                                    />
                                    {/*floor and wall*/}

                                    <Line.Segment
                                        point1={[0, -2]}
                                        point2={[0, 1000]}
                                        style="dashed"
                                    />
                                    <Line.Segment
                                        point1={[-7.5, -2]}
                                        point2={[-7.5, 100]}
                                        style="dashed"
                                    />
                                    <Line.Segment
                                        point1={[7.5, -2]}
                                        point2={[7.5, 100]}
                                        style="dashed"
                                    />
                                    <Polygon
                                        points={springMassPoints}

                                    />
                                    <Vector
                                        tail={[0, -2.75]}
                                        tip={[springMassCenter.point[0], -2.75]}
                                    />
                                    <Vector
                                        tail={[springMassCenter.point[0], springMassCenter.point[1]]}
                                        tip={[springMassCenter.point[0], springMassCenter.point[1] - 3]}
                                    />
                                    <Vector
                                        tail={[springMassCenter.point[0], springMassCenter.point[1] - spring.massSize / 2]}
                                        tip={[springMassCenter.point[0], springMassCenter.point[1] + 3 - spring.massSize / 2]}
                                    />
                                    {springMassCenter.element}
                                    <Text
                                        x={springMassCenter.point[0]}
                                        y={springMassCenter.point[1] - 3 - 0.7}
                                        size={20}
                                    >
                                        G
                                    </Text>
                                    <Text
                                        x={springMassCenter.point[0]}
                                        y={springMassCenter.point[1] + 3 - spring.massSize / 2 + 0.7}
                                        size={20}
                                    >
                                        N
                                    </Text>
                                    {(springMassCenter.point[0] < -0.3 || springMassCenter.point[0] > 0.3) && (
                                        <Text
                                            x={springMassCenter.point[0] / 2}
                                            y={springMassCenter.point[1] - 3}
                                            size={20}
                                        >
                                            Δx
                                        </Text>
                                    )}
                                    {/* actual spring */}
                                    <Line.Segment
                                        point1={[-10, springHAxis]}
                                        point2={[-10 + increment, springHAxis + springRad]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-10 + increment, springHAxis + springRad]}
                                        point2={[-10 + 3 * increment, springHAxis - springRad]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-10 + 3 * increment, springHAxis - springRad]}
                                        point2={[-10 + 5 * increment, springHAxis + springRad]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-10 + 5 * increment, springHAxis + springRad]}
                                        point2={[-10 + 7 * increment, springHAxis - springRad]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-10 + 7 * increment, springHAxis - springRad]}
                                        point2={[-10 + 9 * increment, springHAxis + springRad]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-10 + 9 * increment, springHAxis + springRad]}
                                        point2={[-10 + 11 * increment, springHAxis - springRad]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-10 + 11 * increment, springHAxis - springRad]}
                                        point2={[-10 + 13 * increment, springHAxis + springRad]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-10 + 13 * increment, springHAxis + springRad]}
                                        point2={[-10 + 14 * increment, springHAxis]}
                                        color="gray"
                                    />
                                    {/* actual spring */}
                                    <Text
                                        x={springMassCenter.point[0] + springForce / 100 + (isMassPosRight ? -1 : 1) * (spring.massSize / 2 + 0.7)}
                                        y={springMassCenter.point[1]}
                                        size={20}
                                    >
                                        s
                                    </Text>
                                    <Vector
                                        tail={[springMassCenter.point[0] + (isMassPosRight ? -1 : 1) * spring.massSize / 2, springMassCenter.point[1]]}
                                        tip={[springMassCenter.point[0] + springForce / 100 + (isMassPosRight ? -1 : 1) * spring.massSize / 2, springMassCenter.point[1]]}
                                    />
                                    <Text
                                        x={2}
                                        y={4}
                                        size={12}
                                    >
                                        equilibrium
                                    </Text>
                                    <Text
                                        x={-5}
                                        y={4}
                                        size={12}
                                    >
                                        max distance
                                    </Text>
                                    <Text
                                        x={10}
                                        y={4}
                                        size={12}
                                    >
                                        max distance
                                    </Text>
                                </Mafs>
                                <div className="FBD-info FBD-info-spring">
                                    {createForm(
                                        (e) => {
                                            e.preventDefault();
                                            setMaxDisplacement(maxDisplacementTemp);
                                        },
                                        "maximum displacement from equilibrium (0.1-5): ", maxDisplacementTemp, (e) => setMaxDisplacementTemp(parseFloat(e.target.value)), "0.1", "5", "0.1")
                                    }
                                    <p className="FBD-info-sub">displacement from equilibrium: {displacement.toFixed(2)}</p>
                                    {createForm(
                                        (e) => {
                                            e.preventDefault();
                                            setSpringConst(springConstTemp);
                                        },
                                        "spring constant (50-500):", springConstTemp, (e) => setSpringConstTemp(parseFloat(e.target.value)), 50, 500, 1)
                                    }
                                    <p className="FBD-info-sub FBD-info-normal">spring force: {springForce.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                        {springIsHorizontal === false && (
                            <div className="FBD-container">
                                <Mafs pan={false} zoom={false} width={dimensions.width} height={dimensions.height} viewBox={{ x: [-2, 2], y: [-6, 4] }}>
                                    <Line.Segment
                                        point1={[-100, 3]}
                                        point2={[100, 3]}
                                    />
                                    <Polygon
                                        points={vsMassPoints}
                                    />
                                    <Line.Segment
                                        point1={[-100, 2]}
                                        point2={[100, 2]}
                                        style="dashed"
                                    />
                                    <Text
                                        x={12}
                                        y={1.5}
                                        size={12}
                                    >
                                        maximum distance
                                    </Text>
                                    <Line.Segment
                                        point1={[-100, -4]}
                                        point2={[100, -4]}
                                        style="dashed"
                                    />
                                    <Text
                                        x={12}
                                        y={-4.5}
                                        size={12}
                                    >
                                        maximum distance
                                    </Text>
                                    {/* EQUILIBRIUM */}
                                    <Line.Segment
                                        point1={[-100, -1]}
                                        point2={[100, -1]}
                                        style="dashed"
                                    />
                                    <Text
                                        x={12}
                                        y={-1.5}
                                        size={12}
                                    >
                                        natural equilibrium
                                    </Text>
                                    {((-1 + 6 * (vsEquillibriumDistFromRest) / (2 * maxDisplacement)) < 2) && (
                                        <>
                                            <Line.Segment
                                                point1={[-100, -1 + 6 * (vsEquillibriumDistFromRest) / (2 * maxDisplacement)]}
                                                point2={[100, -1 + 6 * (vsEquillibriumDistFromRest) / (2 * maxDisplacement)]}
                                                style="dashed"
                                            />
                                            <Text
                                                x={vsMassCenterX + 5}
                                                y={(-1 + 6 * (vsEquillibriumDistFromRest) / (2 * maxDisplacement) + vsMassCenterY) / 2}
                                            >Δy</Text>
                                            <Vector
                                                tail={[vsMassCenterX + 4, -1 + 6 * (vsEquillibriumDistFromRest) / (2 * maxDisplacement)]}
                                                tip={[vsMassCenterX + 4, vsMassCenterY]}
                                            />
                                            <Text
                                                x={-12}
                                                y={-1 + 6 * (vsEquillibriumDistFromRest) / (2 * maxDisplacement) + 0.5}
                                                size={12}
                                            >
                                                unstretched length(spring force = 0)
                                            </Text>
                                        </>
                                    )}
                                    {((-1 + 6 * (vsEquillibriumDistFromRest) / (2 * maxDisplacement)) >= 2) && (
                                        <>
                                            <Text
                                                x={vsMassCenterX + 5}
                                                y={(2.5 + vsMassCenterY) / 2}
                                            >Δy</Text>
                                            <Vector
                                                tail={[vsMassCenterX + 4, 2.5]}
                                                tip={[vsMassCenterX + 4, vsMassCenterY]}
                                            />
                                        </>
                                    )}
                                    <Vector
                                        tail={vsMassCenter.point}
                                        tip={[vsMassCenterX, vsMassCenterY - 2]}
                                    />
                                    {vsMassCenter.element}
                                    <Text
                                        x={vsMassCenterX + 0.7}
                                        y={vsMassCenterY - 2}
                                    >G</Text>
                                    {/* actual spring */}
                                    <Line.Segment
                                        point1={[0, 3]}
                                        point2={[vsRad, 3 - vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[vsRad, 3 - vsIncrement]}
                                        point2={[-vsRad, 3 - 3 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-vsRad, 3 - 3 * vsIncrement]}
                                        point2={[vsRad, 3 - 5 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[vsRad, 3 - 5 * vsIncrement]}
                                        point2={[-vsRad, 3 - 7 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[vsRad, 3 - 5 * vsIncrement]}
                                        point2={[-vsRad, 3 - 7 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-vsRad, 3 - 7 * vsIncrement]}
                                        point2={[vsRad, 3 - 9 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[vsRad, 3 - 9 * vsIncrement]}
                                        point2={[-vsRad, 3 - 11 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-vsRad, 3 - 11 * vsIncrement]}
                                        point2={[vsRad, 3 - 13 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[vsRad, 3 - 13 * vsIncrement]}
                                        point2={[-vsRad, 3 - 15 * vsIncrement]}
                                        color="gray"
                                    />
                                    <Line.Segment
                                        point1={[-vsRad, 3 - 15 * vsIncrement]}
                                        point2={[0, 3 - 16 * vsIncrement]}
                                        color="gray"
                                    />
                                    {/* actual spring */}
                                    <Vector
                                        tail={[vsMassCenterX, vsMassCenterY + (vsIsMassPosAboveRest ? -1 : 1) * spring.vsMassSize / 2]}
                                        tip={[vsMassCenterX, springForceTip]}
                                    />
                                    <Text
                                        x={vsMassCenterX + 0.7}
                                        y={springForceTip}
                                    >s</Text>
                                </Mafs>
                                <div className="FBD-info FBD-info-spring">
                                    {createForm(
                                        (e) => {
                                            e.preventDefault();
                                            setVsWeight(vsWeightTemp);
                                        },
                                        "weight (1-100):", vsWeightTemp, (e) => setVsWeightTemp(parseFloat(e.target.value)), 1, 100, 1)
                                    }
                                    {createForm(
                                        (e) => {
                                            e.preventDefault();
                                            setSpringConst(springConstTemp);
                                        },
                                        "spring constant (50-500):", springConstTemp, (e) => setSpringConstTemp(parseFloat(e.target.value)), 50, 500, 1)
                                    }
                                    {createForm(
                                        (e) => {
                                            e.preventDefault();
                                            setMaxDisplacement(maxDisplacementTemp);
                                        },
                                        "maximum displacement from equilibrium (0.1-5): ", maxDisplacementTemp, (e) => setMaxDisplacementTemp(parseFloat(e.target.value)), "0.1", "5", "0.1")
                                    }
                                    <p className="FBD-info-sub">distance of equilibrium from resting position: {vsEquillibriumDistFromRest.toFixed(2)}</p>
                                    <p className="FBD-info-sub">displacement from resting position: {vsDispFromRest.toFixed(2)}</p>
                                    <p className="FBD-info-sub">displacement from equilibrium: {vsDispFromEq.toFixed(2)}</p>
                                    <p className="FBD-info-sub FBD-info-normal">spring force: {vsSpringForce.toFixed(2)}</p>
                                    <p className="FBD-info-sub FBD-info-normal">net force: {vsNetForce.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {(show === "isElevator") && (
                <div className="FBD-container">
                    <Mafs pan={false} zoom={false} width={dimensions.width} height={dimensions.height} viewBox={{ x: [-2, 2], y: [Math.min(-5, eWeightVectorEnd - 1.5, eAccelerationEnd.point[1]), Math.max(5, eAccelerationEnd.point[1])] }}>
                        <Polygon
                            points={elevatorPoints}
                        />
                        {(isNotPastFreeFall) && (
                            <Polygon
                                points={objectPoints}
                            />
                        )}
                        {(!isNotPastFreeFall) && (
                            <Polygon
                                points={objectPointsCeiling}
                            />
                        )}
                        {/* gravity vector */}
                        <Vector
                            tail={[elevator.massCenterX, elevator.massCenterY + (isNotPastFreeFall ? 0 : 4)]}
                            tip={[elevator.massCenterX, eWeightVectorEnd + (isNotPastFreeFall ? 0 : 4)]}
                        />
                        {/* acceleration vector */}
                        <Vector
                            tail={[5, 0]}
                            tip={eAccelerationEnd.point}
                        />
                        {eAccelerationEnd.element}
                        {/* normal force vector */}
                        <Vector
                            tail={[elevator.massCenterX, elevator.massCenterY + (isNotPastFreeFall ? -0.5 : 4.5)]}
                            tip={[elevator.massCenterX, elevator.massCenterY + (isNotPastFreeFall ? -0.5 + eDisplayedNormalForce : 4.5 + eDisplayedNormalForce)]}
                        />
                        <Text
                            x={eAccelerationEnd.point[0] + 1}
                            y={eAccelerationEnd.point[1] / 2}
                        >
                            a
                        </Text>
                        <Text
                            x={elevator.massCenterX}
                            y={eWeightVectorEnd + (isNotPastFreeFall ? 0 : 4) - 1}
                        >
                            G
                        </Text>
                        <Text
                            x={elevator.massCenterX}
                            y={elevator.massCenterY + (isNotPastFreeFall ? 0.5 + eDisplayedNormalForce : 3.5 + eDisplayedNormalForce)}
                        >
                            N
                        </Text>
                    </Mafs>
                    <div className="FBD-info">
                        {createForm(
                            (e) => {
                                e.preventDefault();
                                setEGrav(eGravTemp);
                            },
                            "acceleration due to gravity(1-20): ", eGravTemp, (e) => setEGravTemp(parseFloat(e.target.value)), "1", "20", "0.1")
                        }
                        {createForm(
                            (e) => {
                                e.preventDefault();
                                setEMass(eMassTemp);
                            },
                            "mass of the object(1-20): ", eMassTemp, (e) => setEMassTemp(parseFloat(e.target.value)), "1", "20", "0.1")
                        }
                        <p className="FBD-info-sub">weight: {eWeight.toFixed(2)}</p>
                        <p className="FBD-info-sub">acceleration of the elevator: {eDisplayedAcceleration.toFixed(2)}</p>
                        <p className="FBD-info-sub FBD-info-normal">normal force({isNotPastFreeFall ? "apparent weight" : "force from ceiling"}): {eNormalForce.toFixed(2)}</p>
                        <p className="FBD-info-sub FBD-info-normal">net force on the object: {eNetForce.toFixed(2)}</p>
                        <p className="FBD-info-sub FBD-info-normal">acceleration of the object: {eDisplayedAcceleration.toFixed(2)}</p>
                    </div>
                </div>
            )}
            {(show === "isCircular") && (
                <div className="I-DO-NOTHING">
                    <div className="I-DO-NOTHING">
                        <div className="containerForm">
                            {(circCar === null) && (
                                <div className="spring-options">
                                    <button className="dashBtn" onClick={() => setCircCar(true)}>
                                        car on a flat curve
                                    </button>
                                    <button className="dashBtn" onClick={() => setCircCar(false)}>
                                        vertical loop
                                    </button>
                                </div>
                            )}
                        </div>
                        {(circCar) && (
                            <div className="FBD-container">
                                <Mafs pan={false} zoom={false} width={dimensions.width} height={dimensions.height} viewBox={{ x: [-10, 10],y: [-10, 10] }}>
                                    <Circle
                                        center = {[0, 0]}
                                        radius = {7.5}
                                        color="white"
                                        />
                                    <Circle
                                        center = {[0, 0]}
                                        radius = {9}
                                        color="white"
                                    />
                                    {carCenter.element}
                                </Mafs>
                                <div className="FBD-info FBD-info-spring">
                                    <p className="FBD-info-sub FBD-info-normal">spring force: {springForce.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                        {circCar === false && (
                            <div className="FBD-container">
                                <Mafs pan={false} zoom={false} width={dimensions.width} height={dimensions.height} viewBox={{ x: [-2, 2], y: [-6, 4] }}>
                                    <Text>TEST</Text>
                                </Mafs>
                                <div className="FBD-info FBD-info-spring">
                                    {createForm(
                                        (e) => {
                                            e.preventDefault();
                                            setVsWeight(vsWeightTemp);
                                        },
                                        "weight (1-100):", vsWeightTemp, (e) => setVsWeightTemp(parseFloat(e.target.value)), 1, 100, 1)
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default ForceFBD