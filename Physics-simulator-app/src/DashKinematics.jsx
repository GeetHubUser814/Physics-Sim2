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

    const openCanvas = new CustomEvent("openCanvas");
    const closeCanvas = new CustomEvent("closeCanvas");

    const [subProj, setSubProj] = useState("");

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
        window.dispatchEvent(openCanvas);
    }

    function oneDMotionBtn (){
        setIsOpenOneDMotion((prev) => !prev);
        if(isOpenProjectile || isOpenSolve || isOpenSolveProjectile || isOpenSolveOneD){
            setIsOpenSolve(false);
            setIsOpenProjectile(false);
            setIsOpenSolveProjectile(false);
            setIsOpenSolveOneD(false);
        }
        window.dispatchEvent(openCanvas);
    }

    function solveBtn(){
        setIsOpenSolve((prev) => !prev);
        if(isOpenProjectile || isOpenOneDMotion || isOpenSolveProjectile || isOpenSolveOneD){
            setIsOpenProjectile(false);
            setIsOpenOneDMotion(false);
            setIsOpenSolveProjectile(false);
            setIsOpenSolveOneD(false);
        }
        window.dispatchEvent(closeCanvas);
    }

    function projSolveBtn(){
        setIsOpenSolveProjectile((prev) => !prev);
        if(isOpenProjectile || isOpenOneDMotion || isOpenSolve || isOpenSolveOneD){
            setIsOpenProjectile(false);
            setIsOpenSolve(false);
            setIsOpenOneDMotion(false);
            setIsOpenSolveOneD(false);
        }
    }

    function oneDSolveBtn(){
        setIsOpenSolveOneD((prev) => !prev);
        if(isOpenProjectile || isOpenOneDMotion || isOpenSolve || isOpenSolveOneD){
            setIsOpenProjectile(false);
            setIsOpenSolve(false);
            setIsOpenOneDMotion(false);
            setIsOpenSolveOneD(false);
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
        time: 5,
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

    const [solveProj, setSolveProj] = useState({
        velI: 0,
        angleI: 0,
        angleF: 0,
        elevation: 0,
        accel: 0,
        velIY: 0,
        velIX: 0,
        time: 0,
        velF: 0,
        velFY: 0,
        velFX: 0
    });

    const [solveProjAnswer, setSolveProjAnswer] = useState({
        range: 0,
        max_height: 0,
        time: 0,
        velI: 0,
        velF: 0,
        angleI: 0,
        angleF: 0
    });
    const handleInputChangeSolve = (e) => {
        const {name, value, type} = e.target;

        const finalValue = type === 'number' ? Number(value) : value;

        setSolveProj((prevSolveProj) => ({
            ...prevSolveProj,
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

    const [odDisplace, setOdDisplace] = useState(-12.5);
    const [odDistance, setOdDistance] = useState(62.5);
    const [odFinalVelocity, setOdFinalVelocity] = useState(-15);
    const [odTime, setOdTime] = useState(2);
    const [odVelDistance, setOdVelDistance] = useState(10);

    const handleSubmit = (e) => {
        e.preventDefault();

        setStoreProjectileSim(projectileSim);
        setStoreOneDSim(oneDSim);
        //projectile
        setProjRange(
            Math.round((
                (((-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant) - 
                Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-9.81 / 2) * (projectileSim.elevation))) / -9.81) * 
                (projectileSim.velocity * Math.round((Math.cos(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant)
            ) * 1000) / 1000
        );

        setProjTime(
            Math.round((
                ((-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant) - 
                Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-9.81 / 2) * (projectileSim.elevation))) / -9.81
            ) * 1000) / 1000
        );

        setProjHeight(
            Math.round((
                -Math.pow(-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant, 2)
            ) / (2 * -9.81) * 1000) / 1000
        );

        setProjVelocityMag(
            Math.round((
                Math.sqrt(Math.pow(projectileSim.velocity, 2) + 
                (2 * -9.81 * -projectileSim.elevation))
            ) * 1000) / 1000
        );

        setProjVelocityAngle(
            Math.round((
                Math.atan((-Math.sqrt(Math.pow((projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) + 2 * -9.81 * -projectileSim.elevation)) / 
                (projectileSim.velocity * Math.round((Math.cos(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant)) * (180 / Math.PI)
            ) * 1000) / 1000  
        )
        //1d motion
        setOdDisplace(
            Math.round((oneDSim.velocity * oneDSim.time + (aDirect ? -1 : 1) * 0.5 * oneDSim.acceleration * Math.pow(oneDSim.time, 2)) * 1000) / 1000
        );
        
        setOdDistance(
            Math.round((
                (aDirect ? (
                    Math.abs((oneDSim.velocity * (oneDSim.velocity / oneDSim.acceleration) - 0.5 * oneDSim.acceleration * Math.pow((oneDSim.velocity / oneDSim.acceleration), 2))) + 
                    Math.abs((oneDSim.velocity * (oneDSim.time - (oneDSim.velocity / oneDSim.acceleration)) + 0.5 * oneDSim.acceleration * Math.pow((oneDSim.time - (oneDSim.velocity / oneDSim.acceleration)), 2)))
                ) : (oneDSim.velocity * oneDSim.time + 0.5 * oneDSim.acceleration * Math.pow(oneDSim.time, 2)))
            ) * 1000) / 1000
        );

        setOdFinalVelocity(
            Math.round((
                oneDSim.velocity + (aDirect ? -1 : 1) * oneDSim.acceleration * oneDSim.time
            ) * 1000) / 1000
        )

        setOdTime(
            Math.round((
                oneDSim.velocity / oneDSim.acceleration
            ) * 1000) / 1000
        )

        setOdVelDistance(
            Math.round((
                Math.abs((oneDSim.velocity * (oneDSim.velocity / oneDSim.acceleration) - 0.5 * oneDSim.acceleration * Math.pow((oneDSim.velocity / oneDSim.acceleration), 2)))
            ) * 1000) / 1000
        )
    };
    
    const handleSubmitSolve = (e) => {
        e.preventDefault();

        if(subProj === "range"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                range: 
                Math.round((
                    (((-solveProj.velI * Math.round((Math.sin(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant) - 
                    Math.sqrt(Math.pow(solveProj.velI * (Math.round((Math.sin(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-solveProj.accel / 2) * (solveProj.elevation))) / -solveProj.accel) * 
                    (solveProj.velI * Math.round((Math.cos(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant)
                ) * 1000) / 1000
            }));
        }
        if(subProj === "max height"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                max_height: 
                Math.round(((
                    -Math.pow(-solveProj.velIY, 2)
                ) / (2 * -9.81) + solveProj.elevation) * 1000) / 1000
            }));
        }
        if(subProj === "time"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                time:
                Math.round((
                    ((-solveProj.velIY) - 
                    Math.sqrt(Math.pow(solveProj.velIY, 2) - 4 * (-solveProj.accel / 2) * (solveProj.elevation))) / -solveProj.accel
                ) * 1000) / 1000
            }));
        }
        if(subProj === "velF"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velF:
                Math.round((
                    Math.sqrt(Math.pow(solveProj.velI, 2) + 
                    (2 * -solveProj.accel * -solveProj.elevation))
                ) * 1000) / 1000
            }));
        }
        if(subProj === "angleF"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                angleF:
                Math.round((
                    Math.atan((-Math.sqrt(Math.pow((solveProj.velI * Math.round((Math.sin(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) + 2 * -solveProj.accel * -solveProj.elevation)) / 
                    (solveProj.velI * Math.round((Math.cos(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant)) * (180 / Math.PI)
                ) * 1000) / 1000  
            }));
        }
        if(subProj === "velIOptionOne"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velI: 
                Math.round((
                    (-solveProj.elevation + 0.5 * solveProj.accel * Math.pow(solveProj.time, 2)) / (Math.sin(solveProj.angleI * Math.PI / 180) * solveProj.time)
                ) * 1000) / 1000
                
            }));
        }
        if(subProj === "velIOptionTwo"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velI: 
                Math.round((
                    (-solveProj.velFY + solveProj.accel * solveProj.time) / (Math.sin(solveProj.angleI * Math.PI / 180))
                ) * 1000) / 1000
                
            }));
        }
        if(subProj === "velIOptionThree"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velI: 
                Math.round((
                    Math.sqrt(Math.pow(solveProj.velFY, 2) - 2 * -solveProj.accel * -solveProj.elevation) / (Math.sin(solveProj.angleI * Math.PI / 180))
                ) * 1000) / 1000
                
            }));
        }
        if(subProj === "angleIOptionOne"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                angleI: 
                Math.round((
                    Math.atan(solveProj.velIY / solveProj.velIX) * (180 / Math.PI)
                ) * 1000) / 1000  
            }));
        }
        if(subProj === "angleIOptionTwo"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                angleI: 
                Math.round((
                    Math.asin(Math.sqrt(Math.pow(solveProj.velFY, 2) - 2 * solveProj.accel * solveProj.elevation) / solveProj.velI) * (180 / Math.PI)
                ) * 1000) / 1000  
            }));
        }
    }

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
    /*ANSWER SKILLS USED ETC*/
    const [rangeSkills, maxHeightSkills, timeSkills, velISkillsOne, velISkillsTwo, velISkillsThree, velFSkills, angleISkillsOne, angleISkillsTwo, angleFSkills] = [
        "vector decomposition, separation of horizontal and vertical motion, application of kinematic equations, solving quadratic equations, horizontal range formula", 
        "indentifying peak height, application of kinematic equations", 
        0, 
        0, 
        0, 
        0, 
        0, 
        0, 
        0, 
        0
    ];
    const [rangeSteps, maxHeightSteps, timeSteps, velIStepsOne, velIStepsTwo, velIStepsThree, velFSteps, angleIStepsOne, angleIStepsTwo, angleFSteps] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    const [rangeProp, maxHeightProp, timeProp, velIPropOne, velIPropTwo, velIPropThree, velFProp, angleIPropOne, angleIPropTwo, angleFProp] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];








    /*
    function switchSimulationBtn(){
        setIsRunning(true);
    }
    */
    /*
    CAVEMAN DISCOVERS MAP
    **********
      ******
       ***
        *
        * 
    */
    function repeatSolveInput(inputArray, condition){
        return(
            <div className={subProj === condition ? "b" : "a"}>
                {inputArray.map((_, rowIndex) => (
                            <div key={rowIndex} className="inputDiv">
                                <label>{inputArray[rowIndex][0]}: </label>
                                <input
                                type="number"
                                name={inputArray[rowIndex][1]}
                                onChange={handleInputChangeSolve}
                                value={inputArray[rowIndex][2]}
                                />
                            </div>
                ))}
            </div>
        );
    }

    function repeatInputDiv(inputArray){
        return(
            <form className="containerForm" onSubmit={handleSubmit}>
                {inputArray.map((_, rowIndex) => (
                    <div className="inputDiv">
                        <label>{inputArray[rowIndex][0]}: </label>
                        <input
                        type={inputArray[rowIndex][1]}
                        name={inputArray[rowIndex][2]}
                        value={inputArray[rowIndex][3]}
                        onChange={inputArray[rowIndex][4]}
                        />
                    </div>
                ))}
                <button className="submitBtn" type="submit">Submit</button>
            </form>
        );
    }

    function repeatDisplay(inputArray, containerDiv){
        return(
            <div className={containerDiv}>
                {inputArray.map((_, rowIndex) => (
                    <p>{inputArray[rowIndex][0]}: {inputArray[rowIndex][1]}</p>
                ))}
            </div>
        );
    }

    function repeatSolveBtn(inputArray){
        return(
            <div className="containerForm">
                {inputArray.map((_, rowIndex) => (
                    <div className="solveDiv">
                        <button onClick={() => setSubProj(inputArray[rowIndex][0])}>{inputArray[rowIndex][1]}</button>
                    </div>
                ))}
            </div>
        );
    }

    function solveOptionBtn(inputArray, condition){
        return(
            <div className={subProj === condition ? "b" : "a"}>
                {inputArray.map((_, rowIndex) => (
                    <div key={rowIndex} className="solveOptionsBtnContainer">
                        <button className="inputDiv solveOptionBtn" onClick={() => setSubProj(inputArray[rowIndex][0])}>
                            {inputArray[rowIndex][1]}
                        </button>
                    </div>
                ))}
            </div>
        );
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
                repeatInputDiv([
                    ["elevation", "number", "elevation", projectileSim.elevation, handleInputChangeProj],
                    ["velocity", "number", "velocity", projectileSim.velocity, handleInputChangeProj],
                    ["angle of launch", "number", "launchAngle", projectileSim.launchAngle, handleInputChangeProj],
                    ["acceleration due to gravity", "number", "gravAcceleration", projectileSim.gravAcceleration, handleInputChangeProj]
                ])
            )}
            {(isOpen && isOpenOneDMotion) && (
                repeatInputDiv([
                    ["velocity", "number", "velocity", oneDSim.velocity, handleInputChangeOneD],
                    ["acceleration", "number", "acceleration", oneDSim.acceleration, handleInputChangeOneD],
                    ["acceleration in the same direction as velocity", "checkbox", "accelDirection", oneDSim.accelDirection, handleInputChangeOneD],
                    ["time", "number", "time", oneDSim.time, handleInputChangeOneD]
                ])
            )}
            {(isOpen && (isOpenProjectile || isOpenOneDMotion)) && (
                <button className="startBtn" onClick={startSimulation}>{isRunning ? "Stop Simulation" : "Start Simualtion"}</button>
            )}

            {(isOpen && isOpenProjectile) && (
                repeatDisplay([
                    ["range", projRange],
                    ["time in air", projTime],
                    ["max height from elevation", projHeight],
                    ["final velocity(magnitude)", projVelocityMag],
                    ["final velocity(angle with horizontal)", projVelocityAngle]
                ], "simResult")
            )}

            {(isOpen && isOpenOneDMotion) && (
                repeatDisplay([
                    ["displacement", odDisplace],
                    ["distance", odDistance],
                    ["final velocity", odFinalVelocity],
                    ["time when velocity is zero", odTime],
                    ["distance when velocity is zero", odVelDistance]
                ], "simResult")
            )}
            {(isOpen && isOpenSolve) && (
                <div className="containerForm containerSolve">
                    <div className="solveDiv">
                        <button onClick={projSolveBtn}>projectile motion</button>
                    </div>
                    <div className="solveDiv">
                        <button onClick={oneDSolveBtn}>1d motion</button>
                    </div>
                </div>
            )}
            {(isOpen && isOpenSolveProjectile) && (
                repeatSolveBtn([
                    ["range", "range"],
                    ["max height", "max height"],
                    ["time", "time in the air"],
                    ["velI", "initial velocity"],
                    ["velF", "final velocity"],
                    ["angleI", "angle of launch"],
                    ["angleF", "angle of impact"]
                ])
            )}

            
            {(isOpen && isOpenSolveProjectile) && (
                <div className="solvePopup">
                    <form className="solveContainerForm" onSubmit={handleSubmitSolve}>

                        {repeatSolveInput([
                            ["initial velocity", "velI", solveProj.velI],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "range")}
                       
                        {repeatSolveInput([
                            ["initial vertical velocity", "velIY", solveProj.velIY],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "max height")}

                        {repeatSolveInput([
                            ["initial vertical velocity", "velIY", solveProj.velIY],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "time")}
                        {/* INITIAL 
                        VELOCITY */}
                        {solveOptionBtn([
                            ["velIOptionOne", "solve inputs: t, θ(i), h, g"],
                            ["velIOptionTwo", "solve inputs: t, θ(i), v(f), g"],
                            ["velIOptionThree", "solve inputs: v(f), θ(i), h, g"]
                        ], "velI")}
                        {repeatSolveInput([
                            ["time in air", "time", solveProj.time],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velIOptionOne")} 
                        {repeatSolveInput([
                            ["time in air", "time", solveProj.time],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["final vertical velocity", "velFY", solveProj.velFY],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velIOptionTwo")} 
                        {repeatSolveInput([
                            ["final vertical velocity", "velFY", solveProj.velFY],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velIOptionThree")} 
                        {/* INITIAL 
                        VELOCITY */}

                        {repeatSolveInput([
                            ["initial velocity", "velI", solveProj.velI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velF")}
                        {/* INITIAL
                         ANGLE */}
                        {solveOptionBtn([
                            ["angleIOptionOne", "solve inputs: v(i)(x), v(i)(y)"],
                            ["angleIOptionTwo", "solve inputs: v(i), v(f), h, g"]
                        ], "angleI")}
                        {repeatSolveInput([
                            ["initial horizontal velocity", "velIX", solveProj.velIX],
                            ["initial vertical velocity", "velIY", solveProj.velIY]
                        ], "angleIOptionOne")} 
                        {repeatSolveInput([
                            ["initial velocity", "velIX", solveProj.velIX],
                            ["final vertical velocity", "velFY", solveProj.velFY],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "angleIOptionTwo")} 
                        {/* INITIAL
                         ANGLE */}

                        {repeatSolveInput([
                            ["initial velocity", "velI", solveProj.velI],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "angleF")}
                        <button className="dashBtn" type="submit">Submit</button>
                    </form>
                    {repeatDisplay([
                        ["answer", (subProj === "range" ? solveProjAnswer.range : 
                            (subProj === "max height" ? solveProjAnswer.max_height : 
                                (subProj === "time" ? solveProjAnswer.time : 
                                    (subProj === "velIOptionOne"  ? solveProjAnswer.velI : 
                                        (subProj === "velF" ? solveProjAnswer.velF : 
                                            (subProj === "angleI" ? solveProjAnswer.angleI : 
                                                (subProj === "angleF" ? solveProjAnswer.angleF : 
                                                    (subProj === "velIOptionTwo" ? solveProjAnswer.velI :
                                                        (subProj === "velIOptionThree" ? solveProjAnswer.velI : 
                                                            (subProj === "angleIOptionOne" ? solveProjAnswer.angleI : (
                                                                subProj === "angleIOptionTwo" ? solveProjAnswer.angleI : 0
                                                            )))))))))))],
                        ["skills used", (subProj === "range" ? rangeSkills : 
                            (subProj === "max height" ? maxHeightSkills : 
                                (subProj === "time" ? timeSkills : 
                                    (subProj === "velIOptionOne"  ? velISkillsOne : 
                                        (subProj === "velF" ? velFSkills : 
                                            (subProj === "angleI" ? angleISkillsOne : 
                                                (subProj === "angleF" ? angleFSkills : 
                                                    (subProj === "velIOptionTwo" ? velISkillsTwo :
                                                        (subProj === "velIOptionThree" ? velISkillsThree : 
                                                            (subProj === "angleIOptionOne" ? angleISkillsOne : (
                                                                subProj === "angleIOptionTwo" ? angleISkillsTwo : 0
                                                            )))))))))))],
                        ["steps", (subProj === "range" ? rangeSteps : 
                            (subProj === "max height" ? maxHeightSteps : 
                                (subProj === "time" ? timeSteps : 
                                    (subProj === "velIOptionOne"  ? velIStepsOne : 
                                        (subProj === "velF" ? velFSteps : 
                                            (subProj === "angleI" ? angleIStepsOne : 
                                                (subProj === "angleF" ? angleFSteps : 
                                                    (subProj === "velIOptionTwo" ? velIStepsTwo :
                                                        (subProj === "velIOptionThree" ? velIStepsThree : 
                                                            (subProj === "angleIOptionOne" ? angleIStepsOne : (
                                                                subProj === "angleIOptionTwo" ? angleIStepsTwo : 0
                                                            )))))))))))],
                        ["proportionality", (subProj === "range" ? rangeProp : 
                            (subProj === "max height" ? maxHeightProp : 
                                (subProj === "time" ? timeProp : 
                                    (subProj === "velIOptionOne"  ? velIPropOne : 
                                        (subProj === "velF" ? velFProp : 
                                            (subProj === "angleI" ? angleIPropOne : 
                                                (subProj === "angleF" ? angleFProp : 
                                                    (subProj === "velIOptionTwo" ? velIPropTwo :
                                                        (subProj === "velIOptionThree" ? velIPropThree : 
                                                            (subProj === "angleIOptionOne" ? angleIPropOne : (
                                                                subProj === "angleIOptionTwo" ? angleIPropTwo : 0
                                                            )))))))))))]
                    ], "solveAnswers")}
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