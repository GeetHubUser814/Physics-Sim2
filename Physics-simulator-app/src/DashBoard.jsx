import React, {useState, useEffect} from 'react';

function DashBoard(){

    const [hideName, setHideName] = useState("kinematics");
    const hideFunc = (event, String) => {
        if(String === "kinematics"){
            setHideName(String);
        }else if(String === "force"){
            setHideName(String);
        }else if(String === "work"){
            setHideName(String) ;
        }else if(String === "linear"){
            setHideName(String);
        }
    };
    const kinematicsHide = (e) => hideFunc(e, "kinematics");
    const forceHide = (e) => hideFunc(e, "force");
    const workHide = (e) => hideFunc(e, "work");
    const linearHide = (e) => hideFunc(e, "linear");

    useEffect(() => {
        window.addEventListener("kinCanvas", kinematicsHide);
        window.addEventListener("forceCanvas", forceHide);
        window.addEventListener("WEPCanvas", workHide);
        window.addEventListener("LinearMCanvas", linearHide);

        return () => {
            window.removeEventListener("kinCanvas", kinematicsHide);
            window.removeEventListener("forceCanvas", forceHide);
            window.removeEventListener("WEPCanvas", workHide);
            window.removeEventListener("LinearMCanvas", linearHide);
        }
    }, []);


    const kStyle = {position: "absolute", display: hideName === "kinematics" ? "flex" : "none"};
    const fStyle = {position: "absolute", display: hideName === "force" ? "flex" : "none"};
    const wStyle = {position: "absolute", display: hideName === "work" ? "flex" : "none"};
    const lStyle = {position: "absolute", display: hideName === "linear" ? "flex" : "none"};
    return(
        <div className='dash'>
            <p style={kStyle}>Kinematics</p>
            <p style={fStyle}>Force</p>
            <p style={wStyle}>Work, Energy, Power</p>
            <p style={lStyle}>Linear Momentum</p>
        </div>
    );
}
export default DashBoard