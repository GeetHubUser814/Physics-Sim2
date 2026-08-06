import React, {useEffect, useRef, useState} from 'react';

function DashKinematics() {

    const [isOpen, setIsOpen] = useState(true);
    const [isOpenProjectile, setIsOpenProjectile] = useState(false);
    const [isOpenSolve, setIsOpenSolve] = useState(false);
    const [isOpenOneDMotion, setIsOpenOneDMotion] = useState(false);

    function dashOpenClose(){
        setIsOpen((prev) => !prev);
    }

    function projectileBtn(){
        setIsOpenProjectile((prev) => !prev);
        if(isOpenSolve || isOpenOneDMotion){
            setIsOpenSolve(false);
            setIsOpenOneDMotion(false);
        }
    }

    function oneDMotionBtn (){
        setIsOpenOneDMotion((prev) => !prev);
        if(isOpenProjectile || isOpenSolve){
            setIsOpenSolve(false);
            setIsOpenProjectile(false);
        }
    }

    function solveBtn(){
        setIsOpenSolve((prev) => !prev);
        if(isOpenProjectile || isOpenOneDMotion){
            setIsOpenProjectile(false);
            setIsOpenOneDMotion(false);
        }
    }

    useEffect(() => {
        window.addEventListener("dashOpenClose", dashOpenClose);
        
        return () => {
            window.removeEventListener("dashOpenClose", dashOpenClose);
        }
    }, []);

    return(
        <div>
            {isOpen && (
                <div className="kinematicsBtns">
                    <button className="dashBtn" onClick={projectileBtn}>Projectile</button>
                    <button className="dashBtn" onClick={oneDMotionBtn}>1D Motion</button>
                    <button className="dashBtn" onClick={solveBtn}>Solve</button>
                </div>
            )}
            {(isOpen && isOpenProjectile) && (
            <div className="kinematicsDash">
                <div className="dashForm">
                    <label htmlFor="elevation">Elevation:</label>
                    <input type="number" id="elevation" name="elevation"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="velocity">Velocity:</label>
                    <input type="number" id="velocity" name="velocity"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="mass">Mass:</label>
                    <input type="number" id="mass" name="mass"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="angle">Angle of Launch:</label>
                    <input type="number" id="angle" name="angle"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="gravity">Acceleration due to Gravity:</label>
                    <input type="number" id="gravity" name="gravity"></input>
                </div>
            </div>
            )}
            {(isOpen && isOpenOneDMotion) && (
            <div className="kinematicsDash">
                <div className="dashForm">
                    <label htmlFor="initialVelocity">Initial velocity:</label>
                    <input type="number" id="initialVeloctiy" name="initialVeloctiy"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="acceleration">Acceleration:</label>
                    <input type="number" id="acceleration" name="acceleration"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="accelerationDirection">Accleration is in the same Direction as Velocity:</label>
                    <input type="checkbox" id="accelerationDirection" name="accelerationDirection"></input>
                </div>
            </div>
            )}
            {(isOpen && isOpenSolve) && (
            <div className="kinematicsDash">
                <p className="solveFor">Solve For: </p>
                <div className="dashForm">
                    <label htmlFor="solveRange">Range</label>
                    <input type="radio" id="solveRange" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveMaxHeight">Max Height</label>
                    <input type="radio" id="solveMaxHeight" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveTime">Time in the Air</label>
                    <input type="radio" id="solveTime" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveInitialVelocity">Initial Velocity</label>
                    <input type="radio" id="solveInitialVelocity" name="solveKinematics"/>
                </div>

               <div className="dashForm">
                    <label htmlFor="solveFinalVelocity">Final Velocity</label>
                    <input type="radio" id="solveFinalVelocity" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveAngle">Angle of Launch</label>
                    <input type="radio" id="solveAngle" name="solveKinematics"/>
                </div>
            </div>
            )}
        </div>
    );
}

export default DashKinematics