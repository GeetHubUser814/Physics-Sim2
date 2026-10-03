import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function ForceFBD() {

    const [FBD, setFBD] = useState({
        isRamp: false,
        isAtwood: false,
        isSpring: false,
        isElevator: false,
        isCircular: false
    });
    useEffect(() => {
        window.addEventListener("rampFBD", () => {setFBD({...false, isRamp: true}), console.log("bro")});
        window.addEventListener("atwoodFBD", () => setFBD({...false, isAtwood: true}));
        window.addEventListener("springFBD", () => setFBD({...false, isSpring: true}));
        window.addEventListener("elevatorFBD", () => setFBD({...false, isElevator: true}));
        window.addEventListener("circularFBD", () => setFBD({...false, isCircular: true}));

        return () => {
            window.removeEventListener("rampFBD", () => {setFBD({...false, isRamp: true}), console.log("bro")});
            window.removeEventListener("atwoodFBD", () => setFBD({...false, isAtwood: true})); 
            window.removeEventListener("springFBD", () => setFBD({...false, isSpring: true}));
            window.removeEventListener("elevatorFBD", () => setFBD({...false, isElevator: true}));
            window.removeEventListener("circularFBD", () => setFBD({...false, isCircular: true})); 
        }
    }, []);
    return (
        <div>
            {FBD.isRamp && (
                <div>RAMP</div>
            )}
            {FBD.isAtwood && (
                <div>ATWOOD</div>
            )}
            {FBD.isSpring && (
                <div>SPRING</div>
            )}
            {FBD.isElevator && (
                <div>ELEVATOR</div>
            )}
            {FBD.isCircular && (
                <div>CIRCULAR</div>
            )}
        </div>
    );
}
export default ForceFBD