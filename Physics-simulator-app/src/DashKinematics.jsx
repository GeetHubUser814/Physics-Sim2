import React, {useEffect, useRef, useState} from 'react';
import { useProjectileStore } from './ProjectileSimStore';
import { useOneDStore } from './OneDSimStore';
import ProjectileMotionGraph from './ProjectileMotionGraph';
import OneDMotionGraph from './OneDMotionGraph';
//import {Mafs, CartesianCoordinates, Plot, Line} from 'mafs';

function DashKinematics() {

    const [isOpen, setIsOpen] = useState(true);
    const [open, setOpen] = useState({
        projectile: false,
        graph: false,
        oneDMotion: false,
        graphProjectile: false,
        graphOneD: false,
        equations: false,
    });

    const openCanvas = new CustomEvent("openCanvas");
    const closeCanvas = new CustomEvent("closeCanvas");
    const coverCanvas = new CustomEvent("coverCanvas");
    const coverDownCanvas = new CustomEvent("coverDownCanvas");

    const [subProj, setSubProj] = useState("");

    function dashOpenClose(){
        setIsOpen((prev) => !prev);
    }

    function projectileBtn(){
        setOpen((prev) => ({...false, projectile: !prev.projectile}));

        window.dispatchEvent(openCanvas);
        window.dispatchEvent(coverDownCanvas);
    }

    function oneDMotionBtn (){
        setOpen((prev) => ({...false, oneDMotion: !prev.oneDMotion}));
        window.dispatchEvent(openCanvas);
        window.dispatchEvent(coverDownCanvas);
    }

    function GraphBtn(){
        setOpen((prev) => ({...false, graph: !prev.graph}));
        window.dispatchEvent(closeCanvas);
    }
    function equationsBtn(){
        setOpen((prev) => ({...false, equations: !prev.equations}));
        window.dispatchEvent(closeCanvas);
        window.dispatchEvent(coverCanvas);
    }
    function projGraphBtn(){
        setOpen((prev) => ({...false, graphProjectile: true}));
        setOpen((prev) => ({...prev, graph: false}));
        window.dispatchEvent(coverCanvas);
    }

    function oneDGraphBtn(){
        setOpen((prev) => ({...false, graphOneD: true}));
        setOpen((prev) => ({...prev, graph: false}));
        window.dispatchEvent(coverCanvas);
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
        elevation: 30,
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
/* HANDLE SUBMIT */

    const roundingConstant = 1000000;
 
    const [projRange, setProjRange] = useState(23.312);
    const [projTime, setProjTime] = useState(3.297);
    const [projHeight, setProjHeight] = useState(2.548);
    const [projVelocityMag, setProjVelocityMag] = useState(26.241);
    const [projVelocityAngle, setProjVelocityAngle] = useState(-74.368);

    const [odDisplace, setOdDisplace] = useState(-12.5);
    const [odDistance, setOdDistance] = useState(32.5);
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
                Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-projectileSim.gravAcceleration / 2) * (projectileSim.elevation))) / -projectileSim.gravAcceleration) * 
                (projectileSim.velocity * Math.round((Math.cos(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant)
            ) * 1000) / 1000
        );

        setProjTime(
            Math.round((
                ((-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant) - 
                Math.sqrt(Math.pow(projectileSim.velocity * (Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-projectileSim.gravAcceleration / 2) * (projectileSim.elevation))) / -projectileSim.gravAcceleration
            ) * 1000) / 1000
        );

        setProjHeight(
            Math.round((
                -Math.pow(-projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant, 2)
            ) / (2 * -projectileSim.gravAcceleration) * 1000) / 1000
        );

        setProjVelocityMag(
            Math.round((
                Math.sqrt(Math.pow(projectileSim.velocity, 2) + 
                (2 * -projectileSim.gravAcceleration * -projectileSim.elevation))
            ) * 1000) / 1000
        );

        setProjVelocityAngle(
            Math.round((
                Math.atan((-Math.sqrt(Math.pow((projectileSim.velocity * Math.round((Math.sin(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) + 2 * -projectileSim.gravAcceleration * -projectileSim.elevation)) / 
                (projectileSim.velocity * Math.round((Math.cos(projectileSim.launchAngle * Math.PI / 180)) * roundingConstant) / roundingConstant)) * (180 / Math.PI)
            ) * 1000) / 1000  
        )
        //1d motion
        setOdDisplace(
            Math.round((oneDSim.velocity * oneDSim.time + (aDirect ? -1 : 1) * 0.5 * oneDSim.acceleration * Math.pow(oneDSim.time, 2)) * 1000) / 1000
        );
        
        setOdDistance(
            Math.round((
                ((!aDirect || ((oneDSim.velocity / oneDSim.acceleration) > oneDSim.time)) ? (oneDSim.velocity * oneDSim.time + (aDirect ? -1 : 1) * 0.5 * oneDSim.acceleration * Math.pow(oneDSim.time, 2)) : (
                    Math.abs((oneDSim.velocity * (oneDSim.velocity / oneDSim.acceleration) - 0.5 * oneDSim.acceleration * Math.pow((oneDSim.velocity / oneDSim.acceleration), 2))) + 
                    Math.abs((0.5 * oneDSim.acceleration * Math.pow((oneDSim.time - (oneDSim.velocity / oneDSim.acceleration)), 2)))
                ))
            ) * 1000) / 1000
        );
        setOdFinalVelocity(
            Math.round((
                oneDSim.velocity + (aDirect ? -1 : 1) * oneDSim.acceleration * oneDSim.time
            ) * 1000) / 1000
        )
        setOdTime(
            (oneDSim.accelDirection ? "N/A" : 
                Math.round((
                    oneDSim.velocity / oneDSim.acceleration
                ) * 1000) / 1000
            )
        )

        setOdVelDistance(
            (oneDSim.accelDirection ? "N/A" :
                Math.round((
                    Math.abs((oneDSim.velocity * (oneDSim.velocity / oneDSim.acceleration) - 0.5 * oneDSim.acceleration * Math.pow((oneDSim.velocity / oneDSim.acceleration), 2)))
                ) * 1000) / 1000
            )
        )
    };
    


    const [isRunning, setIsRunning] = useState(false);

    function startSimulation(){
        if(open.projectile){
            const startEndSimProj = new CustomEvent("startEndSimProj");
            window.dispatchEvent(startEndSimProj);    
        }else if(open.oneDMotion){
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
                                //onChange={/*handleInputChangeSolve*/}
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
                    <div className="inputDiv" key={rowIndex}>
                        <label>{inputArray[rowIndex][0]}: </label>
                        <input
                        type={inputArray[rowIndex][1]}
                        name={inputArray[rowIndex][2]}
                        value={inputArray[rowIndex][3]}
                        onChange={inputArray[rowIndex][4]}
                        min={inputArray[rowIndex][5]}
                        max={inputArray[rowIndex][6]}
                        step="any"
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
                    <p key={rowIndex}>{inputArray[rowIndex][0]}: {inputArray[rowIndex][1]}</p>
                ))}
            </div>
        );
    }
    function equationsList(inputArray){
        return(
            <div className="eqContainer">
                {inputArray.map((_, rowIndex) => (
                    <div className="eqSub" key={rowIndex}>
                        <p className="eqDesc">{inputArray[rowIndex][0]}</p>
                        <p className="eqBorder">|</p>

                        {inputArray[rowIndex][1]}                        

                        <button className="dashBtn" onClick={() => showDerivation(inputArray[rowIndex][2])}>derivation</button>
                    </div>
                ))}
            </div>
        );
    }
    const [derivationShow, setDerivationShow] = useState({
        k1: false,
        k2: false,
        k3: false,
        avgV: false,
        range: false,
        maxHeight: false,
        impactVel: false,
        impactAngle: false,
    });
    function showDerivation(show){
        setDerivationShow((prev) => ({
            ...prev,
            [show]: true,
        }))
    }
    function derivation(txt){
        return(
            <div className="derBigContainer">
                <div className="derContainer"></div>
                    <p className="derCloseBtn" onClick={() => setDerivationShow((prev) => ({...false}))}>X</p>
                    <div className="der">
                        <div className="derTxt">
                            <p>{txt}</p>
                    </div>
                </div>
            </div>
        );
    }
    function fraction(str, split, classes){
        return(
            <span className="fraction">
                {mathNotation(str.substring(0, str.indexOf(split)), classes, ",")}
                <span className="fractionLine">
                {
                                Array.from({length: 
                                    Math.max(
                                        str.substring(0, str.indexOf(split)).split(",").length, 
                                        str.substring(str.indexOf(split) + 1, str.length).split(",").length
                                    )
                                }, (_, index) => (
                            <span>—</span>
                        ))
                    }
                </span>
                {mathNotation(str.substring(str.indexOf(split) + 1, str.length), "denominator", ",")}
            </span>
        );
    }
    function mathNotation(txt, spanClass, split){
        const txtArr = txt.split(split);
        return(
            <span className={spanClass}>
                {txtArr.map((_, index) => (
                    <span key={index}>
                        {(txtArr[index].includes("/")) ? (
                            fraction(txtArr[index], "/", "numerator")
                        )  : (txtArr[index].includes("|")) ? (
                            fraction(txtArr[index], "|", "numerator numeratorWithSub")
                        ) : (txtArr[index].includes("_")) ? (
                            <span className="sub">{txtArr[index].substring(1, txtArr[index].length)}</span>
                        ) : (txtArr[index] === "=") ? (
                            <span>=</span>
                        ) : (txtArr[index] === "sqrt") ? (
                            <span className="sqrt">{"\u221A"}</span>
                        ) : (txtArr[index].includes("^")) ? (
                            <span className="exponent">{txtArr[index].substring(1, txtArr[index].length)}</span>
                        ) : (
                            <span>{txtArr[index]}</span>
                        )}
                    </span>
                ))}
            </span>
        );
    }
    return(
        <div>
            {isOpen && (
                <div className="kinematicsBtns">
                    <button className="dashBtn" onClick={projectileBtn}>Projectile Motion</button>
                    <button className="dashBtn" onClick={oneDMotionBtn}>1D Motion</button>
                    <button className="dashBtn" onClick={GraphBtn}>Graphs</button>
                    <button className="dashBtn" onClick={equationsBtn}>Equations</button>
                </div>
            )}
            {(isOpen && open.projectile) && (
                repeatInputDiv([
                    ["elevation", "number", "elevation", projectileSim.elevation, handleInputChangeProj, 0],
                    ["velocity", "number", "velocity", projectileSim.velocity, handleInputChangeProj, 0],
                    ["angle of launch", "number", "launchAngle", projectileSim.launchAngle, handleInputChangeProj, 0, 89],
                    ["acceleration due to gravity", "number", "gravAcceleration", projectileSim.gravAcceleration, handleInputChangeProj, 0.01]
                ])
            )}
            {(isOpen && open.oneDMotion) && (
                repeatInputDiv([
                    ["velocity", "number", "velocity", oneDSim.velocity, handleInputChangeOneD],
                    ["acceleration", "number", "acceleration", oneDSim.acceleration, handleInputChangeOneD],
                    ["acceleration in the same direction as velocity", "checkbox", "accelDirection", oneDSim.accelDirection, handleInputChangeOneD],
                    ["time", "number", "time", oneDSim.time, handleInputChangeOneD]
                ])
            )}
            {(isOpen && (open.projectile || open.oneDMotion)) && (
                <button className="startBtn" onClick={startSimulation}>{isRunning ? "Stop Simulation" : "Start Simualtion"}</button>
            )}

            {(isOpen && open.projectile) && (
                repeatDisplay([
                    ["range", projRange],
                    ["time in air", projTime],
                    ["max height from elevation", projHeight],
                    ["final velocity(magnitude)", projVelocityMag],
                    ["final velocity(angle with horizontal)", projVelocityAngle]
                ], "simResult")
            )}

            {(isOpen && open.oneDMotion) && (
                repeatDisplay([
                    ["displacement", odDisplace],
                    ["distance", odDistance],
                    ["final velocity", odFinalVelocity],
                    ["time when velocity is zero", odTime],
                    ["distance when velocity is zero", odVelDistance]
                ], "simResult")
            )}
            
            {(isOpen && open.graph) && (
                <div className="graphBtns">
                    <button className="dashBtn" onClick={projGraphBtn}>Projectile Motion Graphs</button>
                    <button className="dashBtn" onClick={oneDGraphBtn}>1D Motion Graphs</button>
                </div>
            )}
            {(isOpen && open.graphProjectile) && (
                <div className="graphContainer">
                    <ProjectileMotionGraph/>
                </div>
            )}
            {(isOpen && open.graphOneD) && (
                <div className="graphContainer">
                    <OneDMotionGraph/>
                </div>
            )}
            {(isOpen && open.equations) && (
                equationsList([
                    ["first kinematics equation", 
                        mathNotation(
                        "Δv—=—at"    
                        , "eq", "—"
                        )
                    , "k1"],
                    ["second kinematics equation", 
                        mathNotation(
                        "Δx—=—v—_0—t—+—1/2—at—^2"    
                        , "eq", "—"
                        )
                    , "k2"],
                    ["third kinematics equation",
                        mathNotation(
                        "v—_f—^2—=—v—_0—^2—+—2aΔx"    
                        , "eq", "—"
                        )
                    , "k3"],
                    ["average velocity-displacement",
                        mathNotation(
                        "v,_0,+,v,_f|2—=—x,_f,-,x,_0|t"    
                        , "eq", "—"
                        )
                    , "avgV"],
                    ["range (no elevation)",
                        mathNotation(
                        "R—=—v,_0,^2,s,i,n,(2θ)|g"    
                        , "eq", "—"
                        )
                    , "range"],
                    ["max height",
                        mathNotation(
                        "y—_f—=—y—_0—+—(v,_0,s,i,n,(θ)),^2|2g"
                        , "eq", "—"
                        )
                    , "maxHeight"],
                    ["projectile's impact velocity",
                        mathNotation(
                        "v—_f—=—sqrt—(v—_0—^2—+—2gh)"
                        , "eq", "—"
                        )
                    , "impactVel"],
                    ["projectile's impact angle with horizontal",
                        mathNotation(
                        "θ—_f—=—tan—^-1—(—v,_y|v,_x—)"
                        , "eq", "—"
                        )
                    , "impactAngle"]
                ])
            )}
            {/* MAKE SURE YOU SHOW WHICH ONES TO MEMORIZE */}
            {/* ADD NORMAL TEXT (EX: x^2) TO MATH NOTATION CONVERTER FUNCTION */}
            {(isOpen && open.equations && derivationShow.k1) && (
                derivation(
                    mathNotation(
                    "Δx—=—v—_0—t—+—1/2—at—^2"    
                    , "derEq", "—"
                    )
                )
            )} 
            {(isOpen && open.equations && derivationShow.k2) && (
                derivation(
                    mathNotation(
                    "Δx—=—v—_0—t—+—1/2—at—^2"    
                    , "derEq", "—"
                    )
                )
            )}
            {(isOpen && open.equations && derivationShow.k3) && (
                derivation("c")
            )}
            {(isOpen && open.equations && derivationShow.avgV) && (
                derivation("d")
            )}
            {(isOpen && open.equations && derivationShow.range) && (
                derivation("e")
            )}
            {(isOpen && open.equations && derivationShow.maxHeight) && (
                derivation("f")
            )}
            {(isOpen && open.equations && derivationShow.impactVel) && (
                derivation("g")
            )}
            {(isOpen && open.equations && derivationShow.impactAngle) && (
                derivation("h")
            )}
        </div>
    );
}

export default DashKinematics

