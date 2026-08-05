import React, {useEffect, useRef, useState} from 'react';

function DashKinematics() {

    const isOpen = useRef(true);
    function dashOpenClose(){
        if(isOpen.current){
            isOpen.current = false;
        }else{
            isOpen.current = true;
        }
    }
    useEffect(() => {
        window.addEventListener("dashOpenClose", dashOpenClose);
        
        return () => {
            window.removeEventListener("dashOpenClose", dashOpenClose);
        }
    }, []);

    return(
        <div className={isOpen.current ? "bigKinematicsDash" : "bigKinematicsDashHide"}>
            <button className="dashBtn">Projectile</button>
            <div className="projectileDash">
                <div className="projectileForm">
                    <label htmlFor="elevation">Elevation:</label>
                    <input type="number" id="elevation" name="elevation"></input>
                </div>

                <div className="projectileForm">
                    <label htmlFor="velocity">Velocity:</label>
                    <input type="number" id="velocity" name="velocity"></input>
                </div>

                <div className="projectileForm">
                    <label htmlFor="mass">Mass:</label>
                    <input type="number" id="mass" name="mass"></input>
                </div>

                <div className="projectileForm">
                    <label htmlFor="angle">Angle of Launch:</label>
                    <input type="number" id="angle" name="angle"></input>
                </div>

                <div className="projectileForm">
                    <label htmlFor="gravity">Acceleration due to Gravity:</label>
                    <input type="number" id="gravity" name="gravity"></input>
                </div>
            </div>
        </div>
    );
}

export default DashKinematics