import React, {useState, useEffect} from 'react';

function DashBoard(){
    useEffect(() => {
        window.addEventListener("kinCanvas", hideFunc("kinematics"));
        window.addEventListener("forceCanvas", hideFunc("force"));
        window.addEventListener("WEPCanvas", hideFunc("work"));
        window.addEventListener("LinearMCanvas", hideFunc("linear"));
    }, []);

    const [hideName, setHideName] = useState("kinematics");
    const hideFunc = (String) => {
        console.log(String);
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