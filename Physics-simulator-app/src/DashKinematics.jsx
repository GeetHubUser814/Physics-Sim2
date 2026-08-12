import React, {useEffect, useRef, useState} from 'react';
import { useProjectileStore } from './ProjectileSimStore';

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
        elevation: 400,
        velocity: 10,
        mass: 1,
        launchAngle: 45,
        gravAcceleration: 9.8,
    });

    const [submitReceipt, setSubmitReceipt] = useState({
        elevation: 400,
        velocity: 10,
        mass: 1,
        launchAngle: 45,
        gravAcceleration: 9.8
    });

    const handleInputChange = (e) => {
        const {name, value, type} = e.target;

        const finalValue = type === 'number' ? Number(value) : value;

        setProjectileSim((prevProjectileSim) => ({
            ...prevProjectileSim,
            [name]: finalValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitReceipt(projectileSim);
    };

    const [isRunning, setIsRunning] = useState(false);

    function startSimulation(){
        if(!isRunning){
            setStoreProjectileSim(submitReceipt);
            const startSimulation = new CustomEvent("startSimulation");
            window.dispatchEvent(startSimulation); 
            setIsRunning(true);
        }else{
            const endSimulation = new CustomEvent("endSimulation");
            window.dispatchEvent(endSimulation);
            setIsRunning(false);
        }
    }

    function switchSimulationBtn(){
        setIsRunning(true);
    }

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
                    onChange={handleInputChange}
                    />
                </div>

                <div className="inputDiv">
                    <label>velocity: </label>
                    <input
                    type="number"
                    name="velocity"
                    value={projectileSim.velocity}
                    onChange={handleInputChange}
                    />
                </div>

                <div className="inputDiv">
                    <label>mass: </label>
                    <input
                    type="number"
                    name="mass"
                    value={projectileSim.mass}
                    onChange={handleInputChange}
                    />
                </div>

                <div className="inputDiv">
                    <label>angle of launch: </label>
                    <input
                    type="number"
                    name="launchAngle"
                    value={projectileSim.launchAngle}
                    onChange={handleInputChange}
                    />
                </div>

                <div className="inputDiv">
                    <label>acceleration due to gravity: </label>
                    <input
                    type="number"
                    name="gravAcceleration"
                    value={projectileSim.gravAcceleration}
                    onChange={handleInputChange}
                    />
                </div>
                
                <button className="submitBtn" type="submit">Submit</button>
            </form>
            )}
            {(isOpen && isOpenOneDMotion) && (
            <div className="kinematicsDash">

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
            
            <div className="submitReceipt" /*draggable="true" onDragEnd={handleDragEnd}
            style={{
                position: 'absolute',
                left: '${position.x}px',
                top: `${position.y}px`,
                cursor: 'grab',
                width: '10vw',
                height: '30vh',
                position: 'absolute',
                fontSize: '2vh',
                padding: '1vh',
                fontFamily: 'monospace',
                border: '1vh solid',
                borderRadius: '1vh',
                backgroundColor: 'rgb(111, 60, 199)',
                borderColor: 'rgb(139, 95, 214)',
                color: 'white',
                cursor: 'grab',
                userSelect: 'none'
            }}*/>
                <p>elevation: {submitReceipt.elevation}</p>
                <p>velocity:{submitReceipt.velocity}</p>
                <p>mass:{submitReceipt.mass}</p>
                <p>angle of launch:{submitReceipt.launchAngle}</p>
                <p>acceleration due to gravity:{submitReceipt.gravAcceleration}</p>
            </div>
            <button className="startBtn" onClick={startSimulation}>{isRunning ? "Stop Simulation" : "Start Simualtion"}</button>
        </div>
    );
}

export default DashKinematics

/*
Projectile Motion-
    elevation, velocity, mass, angle of launch, acceleration due to gravity
1D Motion-
    velocity, acceleration, acceleration in the same direction of velocity, time
Sovle-
    Projectile-
        range, max height, time in the air, initial velocity, final velocity, angle of launch
    1D Motion-
        Displacement, Distance, Time, Initial Velocity, Final Velocity, Acceleration


*/