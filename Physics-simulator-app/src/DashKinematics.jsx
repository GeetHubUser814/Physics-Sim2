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
                    <label htmlFor="elevation">Elevation:(m)</label>
                    <input type="number" id="elevation" name="elevation" placeholder="50"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="velocity">Velocity(m/s):</label>
                    <input type="number" id="velocity" name="velocity"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="mass">Mass(kg):</label>
                    <input type="number" id="mass" name="mass"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="angle">Angle of Launch(deg):</label>
                    <input type="number" id="angle" name="angle"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="gravity">Acceleration due to Gravity(m/s<sup>2</sup>):</label>
                    <input type="number" id="gravity" name="gravity"></input>
                </div>

                <div className="nextBtn">
                    <button>Next</button>
                </div>
            </div>
            )}
            {(isOpen && isOpenOneDMotion) && (
            <div className="kinematicsDash">
                <div className="dashForm">
                    <label htmlFor="initialVelocity">Initial velocity(m/s):</label>
                    <input type="number" id="initialVeloctiy" name="initialVeloctiy"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="acceleration">Acceleration(m/s<sup>2</sup>):</label>
                    <input type="number" id="acceleration" name="acceleration"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="accelerationDirection">Accleration is in the same Direction as Velocity:</label>
                    <input type="checkbox" id="accelerationDirection" name="accelerationDirection"></input>
                </div>

                <div className="nextBtn">
                    <button>Next</button>
                </div>
            </div>
            )}
            {(isOpen && isOpenSolve) && (
            <div className="kinematicsDash">
                <p className="solveFor">Solve For: </p>

                <div className="dashForm">
                    <label htmlFor="solveForProjectiles">Projectile</label>
                    <input type="radio" id="solveForProjectiles" name="solveFor"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveForOneDMotion">1D Motion</label>
                    <input type="radio" id="solveForOneDMotion" name="solveFor"/>
                </div>
                
                <div className="nextBtn">
                    <button onClick={solveNext}>Next</button>
                </div>
            </div>
            )}
        </div>
    );
}

export default DashKinematics


/*
               <p className="solveFor">Solve For: </p>
                <div className="dashForm">
                    <label htmlFor="solveRange">Range(m)</label>
                    <input type="radio" id="solveRange" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveMaxHeight">Max Height(m)</label>
                    <input type="radio" id="solveMaxHeight" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveTime">Time in the Air(s)</label>
                    <input type="radio" id="solveTime" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveInitialVelocity">Initial Velocity(m/s)</label>
                    <input type="radio" id="solveInitialVelocity" name="solveKinematics"/>
                </div>

               <div className="dashForm">
                    <label htmlFor="solveFinalVelocity">Final Velocity(m/s)</label>
                    <input type="radio" id="solveFinalVelocity" name="solveKinematics"/>
                </div>

                <div className="dashForm">
                    <label htmlFor="solveAngle">Angle of Launch(deg)</label>
                    <input type="radio" id="solveAngle" name="solveKinematics"/>
                </div>
*/