import React, {useEffect, useRef, useState} from 'react';
import { useProjectileStore } from './ProjectileSimStore';
import { useOneDStore } from './OneDSimStore';

function DashKinematics() {

    const [isOpen, setIsOpen] = useState(true);
    const [isOpenProjectile, setIsOpenProjectile] = useState(false);
    const [isOpenSolve, setIsOpenSolve] = useState(false);
    const [isOpenOneDMotion, setIsOpenOneDMotion] = useState(false);
    const [isOpenSolveProjectile, setIsOpenSolveProjectile] = useState(false);
    const[isOpenSolveOneD, setIsOpenSolveOneD] = useState(false);


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



/*sim stuff*/
    const storeProjectileSim = useProjectileStore((state) => state.projectileSim);
    const updateProjectileSim = useProjectileStore((state) => state.updateProjectileSim);
    const setStoreProjectileSim = useProjectileStore((state) => state.setStoreProjectileSim);

    const [projectileSim, setProjectileSim] = useState({
        elevation: 200,
        velocity: 10,
        launchAngle: 45,
        gravAcceleration: 9.81,
    });
    /*
    const [submitReceipt, setSubmitReceipt] = useState({
        elevation: 400,
        velocity: 10,
        launchAngle: 45,
        gravAcceleration: 9.8
    });
    */
    const handleInputChangeProj = (e) => {
        const {name, value, type} = e.target;

        const finalValue = type === 'number' ? Number(value) : value;

        setProjectileSim((prevProjectileSim) => ({
            ...prevProjectileSim,
            [name]: finalValue,
        }));
    };
/* 1D SIM*/
    const storeOneDSim = useOneDStore((state) => state.oneDSim);
    const updateOneDSim = useOneDStore((state) => state.updateOneDSim);
    const setStoreOneDSim = useOneDStore((state) => state.setStoreOneDSim);

    const [oneDSim, setOneDSim] = useState({
        velocity: 10,
        acceleration: 5,
        accelDirection: false,
        time: 10,
    });

    const [aDirect, setADirect] = useState(true);
    const handleInputChangeOneD = (e) => {
        const {name, value, type} = e.target;

        if(type === 'checkbox'){
            setADirect((prev) => !prev);
        }

        const finalValue = type === 'number' ? Number(value) : aDirect;

        setOneDSim((prevOneDSim) => ({
            ...prevOneDSim,
            [name]: finalValue,
        }));
    };
/* HANDLE SUBMIT */

    const roundingConstant = 1000000;
 
    const [projRange, setProjRange] = useState(50.536);
    const [projTime, setProjTime] = useState(7.147);
    const [projHeight, setProjHeight] = useState(2.548);
    const [projVelocityMag, setProjVelocityMag] = useState(63.435);
    const [projVelocityAngle, setProjVelocityAngle] = useState(-83.6);

    const handleSubmit = (e) => {
        e.preventDefault();

        setStoreProjectileSim(projectileSim);
        setStoreOneDSim(oneDSim);

        setProjRange(
            Math.round(((((-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant) - 
            Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-9.81 / 2) * (projectileSim.elevation))) / -9.81) * 
            (projectileSim.velocity * Math.round((Math.cos(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant)) * 1000) / 1000
        );

        setProjTime(
            Math.round((((-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant) - 
            Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-9.81 / 2) * (projectileSim.elevation))) / 
            -9.81) * 1000) / 1000
        );

        setProjHeight(
            Math.round((-Math.pow(-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant, 2)) / 
            (2 * -9.81) * 1000) / 1000
        );

        setProjVelocityMag(
            Math.round((Math.sqrt(Math.pow(projectileSim.velocity, 2) + 
            (2 * -9.81 * -projectileSim.elevation))) * 1000) / 1000
        );

        setProjVelocityAngle(
            Math.round((Math.atan((-Math.sqrt(Math.pow((projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) + 2 * -9.81 * -projectileSim.elevation)) / 
            (projectileSim.velocity * Math.round((Math.cos(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant)) * (180 / Math.PI)) * 1000) / 1000  
        )

        /*
            ((-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * 1000) / 1000) - 
            Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * 1000) / 1000), 2) - 4 * (-9.81 / 2)(projectileSim.elevation)))/(2 * (-9.81 / 2))

            Math.round(((-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * 1000) / 1000) - Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * 1000) / 1000), 2) - 4 * (-10 / 2) * (projectileSim.elevation))) * 1000) / 1000
            
        const submitValues = new CustomEvent("submitValues");
        window.dispatchEvent(submitValues);
        */
    };
    
    const [isRunning, setIsRunning] = useState(false);

    function startSimulation(){
        if(isOpenProjectile){
            const startEndSimProj = new CustomEvent("startEndSimProj");
            window.dispatchEvent(startEndSimProj);    
        }else if(isOpenOneDMotion){
            const startEndSimOneD = new CustomEvent("startEndSimOneD");
            window.dispatchEvent(startEndSimOneD);
        }
        if(!isRunning){
            setIsRunning(true);
        }else{
            setIsRunning(false);
        }
    }

    /*
    function switchSimulationBtn(){
        setIsRunning(true);
    }
    */

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
            <form className="containerForm" onSubmit={handleSubmit}>
                <div className="inputDiv">
                    <label>elevation: </label>
                    <input
                    type="number"
                    name="elevation"
                    value={projectileSim.elevation}
                    onChange={handleInputChangeProj}
                    />
                </div>

                <div className="inputDiv">
                    <label>velocity: </label>
                    <input
                    type="number"
                    name="velocity"
                    value={projectileSim.velocity}
                    onChange={handleInputChangeProj}
                    />
                </div>

                <div className="inputDiv">
                    <label>angle of launch: </label>
                    <input
                    type="number"
                    name="launchAngle"
                    value={projectileSim.launchAngle}
                    onChange={handleInputChangeProj}
                    />
                </div>

                <div className="inputDiv">
                    <label>acceleration due to gravity: </label>
                    <input
                    type="number"
                    name="gravAcceleration"
                    value={projectileSim.gravAcceleration}
                    onChange={handleInputChangeProj}
                    />
                </div>
                
                <button className="submitBtn" type="submit">Submit</button>
                
            </form>
            )}
            {(isOpen && isOpenOneDMotion) && (
            <div className="kinematicsDash">
            <form className="containerForm" onSubmit={handleSubmit}>
                <div className="inputDiv">
                    <label>velocity: </label>
                    <input
                    type="number"
                    name="velocity"
                    value={oneDSim.velocity}
                    onChange={handleInputChangeOneD}
                    />
                </div>

                <div className="inputDiv">
                    <label>acceleration: </label>
                    <input
                    type="number"
                    name="acceleration"
                    value={oneDSim.acceleration}
                    onChange={handleInputChangeOneD}
                    />
                </div>

                <div className="inputDiv">
                    <label>acceleration in the same direction as velocity: </label>
                    <input
                    type="checkbox"
                    name="accelDirection"
                    value={oneDSim.accelDirection}
                    onChange={handleInputChangeOneD}
                    />
                </div>

                <div className="inputDiv">
                    <label>time: </label>
                    <input
                    type="number"
                    name="time"
                    value={oneDSim.time}
                    onChange={handleInputChangeOneD}
                    />
                </div>
                
                <button className="submitBtn" type="submit">Submit</button>
                
            </form>
            </div>
            )}
            {(isOpen && isOpenSolve) && (
            <div className="kinematicsDash">


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
            {(isOpen && (isOpenProjectile || isOpenOneDMotion)) && (
                <button className="startBtn" onClick={startSimulation}>{isRunning ? "Stop Simulation" : "Start Simualtion"}</button>
            )}

            {(isOpen && isOpenProjectile) && (
            <div className="simResult">
                <p>range: {projRange}</p>
                <p>time in air: {projTime}</p>
                <p>max height from elevation: {projHeight}</p>
                <p>final velocity(magnitude): {projVelocityMag}</p>
                <p>final velocity(angle with horizontal): {projVelocityAngle}</p>
            </div>
            )}
        </div>
    );
}

export default DashKinematics

/*
Projectile Motion-
    elevation, velocity, angle of launch, acceleration due to gravity
1D Motion-
    velocity, acceleration, acceleration in the same direction of velocity, time
Sovle-
    Projectile-
        range, max height, time in the air, initial velocity, final velocity, angle of launch
    1D Motion-
        Displacement, Distance, Time, Initial Velocity, Final Velocity, Acceleration



            <div className="submitReceipt">
                <p>elevation: {submitReceipt.elevation}</p>
                <p>velocity:{submitReceipt.velocity}</p>
                <p>mass:{submitReceipt.mass}</p>
                <p>angle of launch:{submitReceipt.launchAngle}</p>
                <p>acceleration due to gravity:{submitReceipt.gravAcceleration}</p>
            </div>

            <button className="submitBtn" type="submit">Submit</button>
*/