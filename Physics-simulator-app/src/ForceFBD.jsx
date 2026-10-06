import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function ForceFBD({show}) {

    const rampHeight = 2;
    const rampWidth = 1.5;
    const rampTop = useMovablePoint([-3, rampHeight], {
        constrain: ([x, y]) => [-3, Math.max(-3, y)]
    });
    const gravEnd = useMovablePoint([-2, -1], {
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
    function distance(p1, p2){
        return Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    }
    return (
        <div>
            {show === "isRamp" && (
                <div className="FBD-container">
                    <Mafs pan={false} zoom={false}>
  
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
                </div>  
            )}
            <div className="FBD-info">
                <p>theta: {ramp.theta.toFixed(3)}</p>
                <p>normal force: {normalMagnitude.toFixed(3)}</p>
                <p>weight: {gravMagnitude.toFixed(3)}</p>
                <p>parallel component of gravity: {tangentMagnitude.toFixed(3)}</p>
            </div>
        </div>
    );
}
export default ForceFBD