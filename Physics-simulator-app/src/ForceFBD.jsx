import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function ForceFBD({show}) {

    function distance(p1, p2){
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
    const gravMagnitude = distance([ramp.centerX, ramp.centerY], gravEnd.point);
    const gravNormal = [ramp.centerX - gravMagnitude * Math.sin(2 * ramp.thetaRads) / 2, 
                        ramp.centerY - gravMagnitude * Math.pow(Math.cos(ramp.thetaRads), 2)];
    const gravNormalReal = [ramp.centerX + gravMagnitude * Math.sin(2 * ramp.thetaRads) / 2, 
                            ramp.centerY + gravMagnitude * Math.pow(Math.cos(ramp.thetaRads), 2)];
    const gravTangent = [ramp.centerX + gravMagnitude * Math.sin(2 * ramp.thetaRads) / 2, 
                         ramp.centerY - gravMagnitude * Math.pow(Math.sin(ramp.thetaRads), 2)];
    const normalMagnitude = distance([ramp.centerX, ramp.centerY], gravNormal);
    const tangentMagnitude = distance(gravEnd.point, gravTangent);
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
    return (
        <div>
            {show === "isRamp" && (
                <div className="FBD-container">
                    <Mafs pan={false} zoom={false} height={500} viewBox={{x: [-5, 5], y: [gravEnd.point[1] - 2, Math.max(rampTop.point[1] + 2, gravNormalReal[1] + 2)]}}>
  
                        <Circle
                            center={[ramp.centerX, ramp.centerY]}
                            radius={ramp.rad}

                        />
                        <Polygon
                            points={[rampTop.point, ramp.b, ramp.c]}
                        />
                        <Vector
                            tail={[ramp.centerX, ramp.centerY]}
                            tip={gravEnd.point}
                        />
                        <Vector
                            tail={[ramp.centerX, ramp.centerY]}
                            tip={gravNormal}
                        />
                        <Vector
                            tail={[ramp.centerX, ramp.centerY]}
                            tip={gravTangent}
                        />
                        <Vector
                            tail={[ramp.centerX, ramp.centerY]}
                            tip={gravNormalReal}
                        />
                        {gravEnd.element}

                        {rampTop.element}

                    </Mafs>
                    <div className="FBD-info">
                        <p className="FBD-info-pinkDot">theta: {ramp.theta.toFixed(3)}</p>
                        <p className="FBD-info-pinkDot">weight: {gravMagnitude.toFixed(3)}</p>
                        <p className="FBD-info-normal">normal force: {normalMagnitude.toFixed(3)}</p>
                        <p className="FBD-info-normal">parallel component of gravity: {tangentMagnitude.toFixed(3)}</p>
                        <p className="FBD-info-normal">friction: </p>
                    </div>
                </div>  
            )}
            {show === "isAtwood" && (
                <div className="FBD-container">
                    <Mafs pan={false} zoom={false} height={550} viewBox={{x: [-5, 5], y: [Math.min(mass1GravEnd.point[1] - 1, mass2GravEnd.point[1]) - 1, Math.max(masses.mass1Pos[1] + tensionMagnitude, atwood.pulleyCenterY + atwood.pulleyRad)]}}>
                        {/*pulley*/}
                        <Circle
                            center={[atwood.pulleyCenterX, atwood.pulleyCenterY]}
                            radius={atwood.pulleyRad}
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
                        >mass 1</Text>
                        <Text
                            x={masses.mass2Pos[0] + 1}
                            y={masses.mass2Pos[1]}
                            size={15}
                        >mass 2</Text>
                        {mass1GravEnd.element}
                        {mass2GravEnd.element}
                    </Mafs>
                    <div className="FBD-info">
                        <p className="FBD-info-pinkDot">weight of mass 1: {mass1Weight.toFixed(3)}</p>
                        <p className="FBD-info-pinkDot">weight of mass 2: {mass2Weight.toFixed(3)}</p>
                        <p className="FBD-info-normal">tension in the rope: {(tensionMagnitude * 10).toFixed(3)}</p>
                        <p className="FBD-info-normal">magnitude net force on mass 1: {mass1NetForce.toFixed(3)}</p>
                        <p className="FBD-info-normal">magnitude net force on mass 2: {mass2NetForce.toFixed(3)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ForceFBD