import React, {useEffect, useRef, useState} from 'react';

function DashForce() {

    const [isOpen, setIsOpen] = useState(true);
    const [isOpenRamp, setIsOpenRamp] = useState(false);
    const [isOpenAtwood, setIsOpenAtwood] = useState(false);
    const [isOpenFBD, setIsOpenFBD] = useState(false);
    const [isOpenGraph, setIsOpenGraph] = useState(false);

    const [subForce, setSubForce] = useState("");

    const openCanvas = new CustomEvent("openCanvas");
    const closeCanvas = new CustomEvent("closeCanvas");


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
        window.dispatchEvent(openCanvas);
    }
    function atwoodBtn(){
        setIsOpenAtwood((prev) => !prev);
        setSubForce("atwood");
        if(isOpenRamp || isOpenFBD || isOpenGraph){
            setIsOpenRamp(false);
            setIsOpenFBD(false);
            setIsOpenGraph(false);
        }
        window.dispatchEvent(openCanvas);
    }
    function FBDBtn(){
        setSubForce("FBD");
        setIsOpenFBD((prev) => !prev);
        if(isOpenAtwood || isOpenRamp || isOpenGraph){
            setIsOpenAtwood(false);
            setIsOpenRamp(false);
            setIsOpenGraph(false);
        }
        window.dispatchEvent(openCanvas);
    }
    function graphBtn(){
        setIsOpenGraph((prev) => !prev);
        setSubForce("graph");
        if(isOpenAtwood || isOpenFBD || isOpenRamp){
            setIsOpenAtwood(false);
            setIsOpenFBD(false);
            setIsOpenRamp(false);
        }
        window.dispatchEvent(openCanvas);
    }

    const [rampSim, setRampSim] = useState({
        angle: 30,
        length: 10,
        vI: 45,
        friction: 0,
        topBottom: true,
        gravAcceleration: 9.81
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

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return(
        <div>
            {isOpen && (
                <div className="kinematicsBtns">
                    <button className="dashBtn" onClick={rampBtn}>Ramp Sim</button>
                    <button className="dashBtn" onClick={atwoodBtn}>Atwood Sim</button>
                    <button className="dashBtn" onClick={FBDBtn}>Free Body Diagrams</button>
                    <button className="dashBtn" onClick={graphBtn}>Graphs</button>
                </div>
            )}
            {(isOpen && isOpenRamp) && (
                repeatInputDiv([
                    ["angle with horizontal", "number", "angle", rampSim.angle, handleInputChange, 0],
                    ["length of ramp", "number", "length", rampSim.length, handleInputChange, 0],
                    ["initial velocity", "number", "vI", rampSim.vI, handleInputChange, 0, 89],
                    ["friction", "number", "friction", rampSim.friction, handleInputChange, 0, 89],
                    ["start at bottom", "checkbox", "topBottom", rampSim.topBottom, handleInputChange, 0, 89]
                ])
            )}
            {(isOpen && isOpenAtwood) && (
                repeatInputDiv([
                    ["left mass", "number", "lMass", atwoodSim.lMass, handleInputChange],
                    ["right mass", "number", "rMass", atwoodSim.rMass, handleInputChange],
                    ["how high is left mass from right mass", "number", "lMassHeight", atwoodSim.lMassHeight, handleInputChange],
                ])
            )}
        </div>
    );
}

export default DashForce

