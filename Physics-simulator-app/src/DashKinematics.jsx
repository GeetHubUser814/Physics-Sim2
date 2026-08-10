import React, {useEffect, useRef, useState} from 'react';

function DashKinematics() {

    const [isOpen, setIsOpen] = useState(true);
    const [isOpenProjectile, setIsOpenProjectile] = useState(false);
    const [isOpenSolve, setIsOpenSolve] = useState(false);
    const [isOpenOneDMotion, setIsOpenOneDMotion] = useState(false);
    const [isOpenSolveProjectile, setIsOpenSolveProjectile] = useState(false);
    const[isOpenSolveOneD, setIsOpenSolveOneD] = useState(false);

    /*SIMULATION STUFF*/
    const[elevation_p, setElevation_p] = useState(0);
    const[velocity_p, setVelocity_p] = useState(0);

    function handleChange(event){
        setElevation_p(event.target.value);
    }


    function dashOpenClose(){
        setIsOpen((prev) => !prev);
    }

    function projectileBtn(){
        setIsOpenProjectile((prev) => !prev);
        if(isOpenSolve || isOpenOneDMotion || isOpenSolveProjectile || isOpenSolveOneD){
            setIsOpenSolve(false);
            setIsOpenOneDMotion(false);
            setIsOpenSolveProjectile(false);
            setIsOpenSolveOneD(false);
        }
    }

    function oneDMotionBtn (){
        setIsOpenOneDMotion((prev) => !prev);
        if(isOpenProjectile || isOpenSolve || isOpenSolveProjectile || isOpenSolveOneD){
            setIsOpenSolve(false);
            setIsOpenProjectile(false);
            setIsOpenSolveProjectile(false);
            setIsOpenSolveOneD(false);

        }
    }

    function solveBtn(){
        setIsOpenSolve((prev) => !prev);
        if(isOpenProjectile || isOpenOneDMotion || isOpenSolveProjectile || isOpenSolveOneD){
            setIsOpenProjectile(false);
            setIsOpenOneDMotion(false);
            setIsOpenSolveProjectile(false);
            setIsOpenSolveOneD(false);
        }
    }

    function solveProjectileBtn(){
        setIsOpenSolveProjectile((prev) => !prev);
        if(isOpenProjectile || isOpenOneDMotion || isOpenSolve || isOpenSolveOneD){
            setIsOpenProjectile(false);
            setIsOpenSolve(false);
            setIsOpenOneDMotion(false);
            setIsOpenSolveOneD(false);
        }
    }

    function solveOneDBtn(){
        setIsOpenSolveOneD((prev) => !prev);
        if(isOpenProjectile || isOpenOneDMotion || isOpenSolve || isOpenSolveProjectile){
            setIsOpenProjectile(false);
            setIsOpenSolve(false);
            setIsOpenOneDMotion(false);
            setIsOpenSolveProjectile(false);
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
                    <button className="dashBtn" onClick={projectileBtn}>Projectile Motion</button>
                    <button className="dashBtn" onClick={oneDMotionBtn}>1D Motion</button>
                    <button className="dashBtn" onClick={solveBtn}>Solve</button>
                </div>
            )}
            {(isOpen && isOpenProjectile) && (
            <div className="kinematicsDash">
                <div className="dashForm">
                    <label htmlFor="elevation">Elevation:(m)</label>
                    <input type="number" id="elevation" name="elevation" placeholder="50" min="0" max="100" value={elevation_p} onChange={handleChange}></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="velocity">Velocity(m/s):</label>
                    <input type="number" id="velocity" name="velocity" placeholder="50" min="0" max="100"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="mass">Mass(kg):</label>
                    <input type="number" id="mass" name="mass" placeholder="50" min="0" max="100"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="angle">Angle of Launch(deg):</label>
                    <input type="number" id="angle" name="angle" placeholder="45" min="0" max="90"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="gravity">Acceleration due to Gravity(m/s<sup>2</sup>):</label>
                    <input type="number" id="gravity" name="gravity" placeholder="20" min="0.1" max="40"></input>
                </div>

                <div className="nextBtn">
                    <button className="dashBtn" onClick={() => {console.log(elevation)}}>Next</button>
                </div>
            </div>
            )}
            {(isOpen && isOpenOneDMotion) && (
            <div className="kinematicsDash">
                <div className="dashForm">
                    <label htmlFor="initialVelocity">Initial velocity(m/s):</label>
                    <input type="number" id="initialVeloctiy" name="initialVeloctiy" placeholder="50" min="0" max="100"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="acceleration">Acceleration(m/s<sup>2</sup>):</label>
                    <input type="number" id="acceleration" name="acceleration" placeholder="20" min="0" max="40"></input>
                </div>

                <div className="dashForm">
                    <label htmlFor="accelerationDirection">Accleration is in the same Direction as Velocity:</label>
                    <input type="checkbox" id="accelerationDirection" name="accelerationDirection"></input>
                </div>

                <div className="nextBtn">
                    <button className="dashBtn">Next</button>
                </div>
            </div>
            )}
            {(isOpen && isOpenSolve) && (
            <div className="kinematicsDash">
                <p className="solveFor">Solve For: </p>

                <div className="solveForBack">
                    <button className="dashBtn" onClick={solveProjectileBtn}>Projectile Motion</button>
                </div>
                
                <div className="solveForBack">
                    <button className="dashBtn" onClick={solveOneDBtn}>1D Motion</button>
                </div>



            </div>
            )}

            {(isOpen && isOpenSolveProjectile) && (
            <div className="kinematicsDash">
               <p className="solveFor">Solve For: </p>

                <div className="solveForBack">
                    <button className="dashBtn">Range(m)</button>
                </div>
                
                <div className="solveForBack">
                    <button className="dashBtn">Max Height(m)</button>
                </div>

                <div className="solveForBack">
                    <button className="dashBtn">Time in the Air(s)</button>
                </div>
                
                <div className="solveForBack">
                    <button className="dashBtn">Initial Velocity(m/s)</button>
                </div>

                <div className="solveForBack">
                    <button className="dashBtn">Final Velocity(m/s)</button>
                </div>
                
                <div className="solveForBack">
                    <button className="dashBtn">Angle of Launch(deg)</button>
                </div>
            </div>
            )}

            {(isOpen && isOpenSolveOneD) && (
            <div className="kinematicsDash">
               <p className="solveFor">Solve For: </p>

                <div className="solveForBack">
                    <button className="dashBtn">Displacement(m)</button>
                </div>
                
                <div className="solveForBack">
                    <button className="dashBtn">Distance(m)</button>
                </div>

                <div className="solveForBack">
                    <button className="dashBtn">Time(s)</button>
                </div>
                
                <div className="solveForBack">
                    <button className="dashBtn">Initial Velocity(m/s)</button>
                </div>

                <div className="solveForBack">
                    <button className="dashBtn">Final Velocity(m/s)</button>
                </div>
            </div>
            )}
        </div>
    );
}

export default DashKinematics

