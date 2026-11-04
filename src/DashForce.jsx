import React, {useEffect, useRef, useState} from 'react';
import { useRampStore } from './RampSimStore';
import ForceFBD from './ForceFBD';

function DashForce() {

    const [isOpen, setIsOpen] = useState(true);
    const [isOpenRamp, setIsOpenRamp] = useState(false);
    const [isOpenAtwood, setIsOpenAtwood] = useState(false);
    const [isOpenFBD, setIsOpenFBD] = useState(false);
    const [isOpenGraph, setIsOpenGraph] = useState(false);

    const [FBDDisplay, setFBDDisplay] = useState({
        isRamp: false,
        isAtwood: false,
        isSpring: false,
        isElevator: false,
        isCircular: false
    });
    function getFBDDisplay(){
        for(let i = 0; i < Object.keys(FBDDisplay).length; i++){
            const key = Object.keys(FBDDisplay)[i];
            if(FBDDisplay[key]){
                return key;
            }
        }
        return null;
    }

    const [subForce, setSubForce] = useState("");

    const openCanvas = new CustomEvent("openCanvasForce");
    const closeCanvas = new CustomEvent("closeCanvasForce");
    const coverCanvas = new CustomEvent("coverCanvasForce");
    const coverDownCanvas = new CustomEvent("coverDownCanvasForce");

    const [isRunning, setIsRunning] = useState(false);

    function dashOpenClose(){
        setIsOpen((prev) => !prev);
    }

    useEffect(() => {
        window.addEventListener("dashOpenClose", dashOpenClose);

        return () => {
            window.removeEventListener("dashOpenClose", dashOpenClose);
        }
    }, []);

    function rampBtn(){
        setIsOpenRamp((prev) => !prev);
        setSubForce("ramp");
        if(isOpenAtwood || isOpenFBD || isOpenGraph){
            setIsOpenAtwood(false);
            setIsOpenFBD(false);
            setIsOpenGraph(false);
        }
        setFBDDisplay({
            ...false,
        });
        window.dispatchEvent(openCanvas);
        window.dispatchEvent(coverDownCanvas);
    }
    function atwoodBtn(){
        setIsOpenAtwood((prev) => !prev);
        setSubForce("atwood");
        if(isOpenRamp || isOpenFBD || isOpenGraph){
            setIsOpenRamp(false);
            setIsOpenFBD(false);
            setIsOpenGraph(false);
        }
        setFBDDisplay({
            ...false,
        });
        window.dispatchEvent(openCanvas);
        window.dispatchEvent(coverDownCanvas);
    }
    function FBDBtn(){
        setSubForce("FBD");
        setIsOpenFBD((prev) => !prev);
        if(isOpenAtwood || isOpenRamp || isOpenGraph){
            setIsOpenAtwood(false);
            setIsOpenRamp(false);
            setIsOpenGraph(false);
        }
        window.dispatchEvent(closeCanvas);
        setFBDDisplay({
            ...false,
        });
    }
    function graphBtn(){
        setIsOpenGraph((prev) => !prev);
        setSubForce("graph");
        if(isOpenAtwood || isOpenFBD || isOpenRamp){
            setIsOpenAtwood(false);
            setIsOpenFBD(false);
            setIsOpenRamp(false);
        }
        setFBDDisplay({
            ...false,
        });
        window.dispatchEvent(closeCanvas);
        console.log("graphBtn");
    }

    const setStoreRampSim = useRampStore((state) => state.setStoreRampSim);

    const [rampSim, setRampSim] = useState({
        angle: 30,
        length: 600,
        friction: 0,
    });

    const [atwoodSim, setAtwoodSim] = useState({
        lMass: 10,
        rMass: 5,
        lMassHeight: 0
    });

    const [rDirect, setRDirect] = useState(true);
    const handleInputChange = (e) => {
        const {name, value, type} = e.target;

        if(subForce === "ramp"){
            if(type === 'checkbox'){
                setRDirect((prev) => !prev);
            }

            const finalValue = type === 'number' ? Number(value) : rDirect;

            setRampSim((prev) => ({
                ...prev,
                [name]: finalValue,
            }));
        }else if(subForce === "atwood"){
            const finalValue = type === 'number' ? Number(value) : value;

            setAtwoodSim((prev) => ({
                ...prev,
                [name]: finalValue,
            }));
        }
    };

    //HTML FUNCTIONS
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setStoreRampSim(rampSim);
    };

    function startSimulation(){
        if(isOpenRamp){
            const startEndSimRamp = new CustomEvent("startEndSimRamp");
            window.dispatchEvent(startEndSimRamp);    
        }else if(isOpenAtwood){
            const startEndSimAtwood = new CustomEvent("startEndSimAtwood");
            window.dispatchEvent(startEndSimAtwood);
        }
        if(!isRunning){
            setIsRunning(true);
        }else{
            setIsRunning(false);
        }
    }

    return(
        <div>
            {isOpen && (
                <div className="kinematicsBtns">
                    <button className="dashBtn" onClick={FBDBtn}>Free Body Diagrams</button>
                    <button className="dashBtn" onClick={graphBtn}>Graphs</button>
                    <button className="dashBtn">Equations</button>{/*page with equations used, given equations on exam and niche equations*/}
                </div>
            )}
            {(isOpen && isOpenRamp) && (
                repeatInputDiv([
                    ["angle with horizontal", "number", "angle", rampSim.angle, handleInputChange, 0],
                    ["length of ramp", "number", "length", rampSim.length, handleInputChange, 0],
                    ["friction", "number", "friction", rampSim.friction, handleInputChange, 0, 89]
                ])
            )}
            {(isOpen && isOpenAtwood) && (
                repeatInputDiv([
                    ["left mass", "number", "lMass", atwoodSim.lMass, handleInputChange],
                    ["right mass", "number", "rMass", atwoodSim.rMass, handleInputChange],
                    ["how high is left mass from right mass", "number", "lMassHeight", atwoodSim.lMassHeight, handleInputChange],
                ])
            )}
            {(isOpen && (isOpenRamp || isOpenAtwood)) && (
                <button className="startBtn" onClick={startSimulation}>{isRunning ? "Stop Simulation" : "Start Simualtion"}</button>
            )}
            {(isOpen && isOpenRamp) && (
                repeatDisplay([
                    ["angle(TEST)", rampSim.angle],
                    ["length(TEST)", rampSim.length],
                ], "simResult")
            )}
            {(isOpen && isOpenFBD) && (
                <div className="containerForm">
                    <button className="dashBtn" onClick={() => {setFBDDisplay({...false, isRamp: true}), setIsOpenFBD(false), window.dispatchEvent(coverCanvas);}}>Ramp FBD</button>
                    <button className="dashBtn" onClick={() => {setFBDDisplay({...false, isAtwood: true}), setIsOpenFBD(false), window.dispatchEvent(coverCanvas);}}>Atwood FBD</button>
                    <button className="dashBtn" onClick={() => {setFBDDisplay({...false, isSpring: true}), setIsOpenFBD(false), window.dispatchEvent(coverCanvas);}}>Spring FBD</button>
                    <button className="dashBtn" onClick={() => {setFBDDisplay({...false, isElevator: true}), setIsOpenFBD(false), window.dispatchEvent(coverCanvas);}}>Elevator FBD</button>
                    <button className="dashBtn" onClick={() => {setFBDDisplay({...false, isCircular: true}), setIsOpenFBD(false), window.dispatchEvent(coverCanvas);}}>Circular Motion FBD</button>
                </div>
            )}
            {(isOpen && FBDDisplay.isRamp) && (
                <div className="forceFBDContainer">
                    <ForceFBD show={getFBDDisplay()} />
                </div>
            )}
            {(isOpen && FBDDisplay.isAtwood) && (
                <div className="forceFBDContainer">
                    <ForceFBD show={getFBDDisplay()} />
                </div>
            )}
            {(isOpen && FBDDisplay.isSpring) && (
                <div className="forceFBDContainer">
                    <ForceFBD show={getFBDDisplay()} />
                </div>
            )}
            {(isOpen && FBDDisplay.isElevator) && (
                <div className="forceFBDContainer">
                    <ForceFBD show={getFBDDisplay()} />
                </div>
            )}
            {(isOpen && FBDDisplay.isCircular) && (
                <div className="forceFBDContainer">
                    <ForceFBD show={getFBDDisplay()} />
                </div>
            )}
        </div>
    );
}

export default DashForce

