import React, { useEffect, useRef, useState } from 'react';
import { useRampStore } from './RampSimStore';
import ForceFBD from './ForceFBD';
import ForceGraph from './ForceGraph';
import ForceDer from './ForceDer';
import Mather from './Mather';
import WEPDProj from "./WEPDProj";
import WEPDRamp from './WEPDRamp';
import WEPDSpring from './WEPDSpring';
import WEPDPend from './WEPDPend';

function DashWEP() {
    const [isOpen, setIsOpen] = useState(true);
    const [open, setOpen] = useState({
        diagram: false,
        graph: false,
        eq: false,
    });
    const [diagramDisplay, setDiagramDisplay] = useState({
        projectile: false,
        ramp: false,
        spring: false,
        pendulum: false,
    });
    function showBtn(key) {
        for (let i = 0; i < Object.keys(open).length; i++) {
            if (key === Object.keys(open)[i]) {
                setOpen((prev) => ({
                    ...Object.fromEntries(Object.keys(open).map(k => [k, false])),
                    [key]: !prev[key]
                }));
            }
        }
    }
    function dashOpenClose() {
        setIsOpen((prev) => !prev);
    }
    useEffect(() => {
        window.addEventListener("dashOpenClose", dashOpenClose);

        return () => {
            window.removeEventListener("dashOpenClose", dashOpenClose);
        }
    }, []);
    return (
        <div>
            {(isOpen) && (
                <div className="kinematicsBtns">
                    <button className="dashBtn" onClick={() => { showBtn('diagram'), setDiagramDisplay({...null}) }}>Energy Diagrams</button>
                    <button className="dashBtn" onClick={() => showBtn('graph')}>Graphs</button>
                    <button className="dashBtn" onClick={() => showBtn('eq')}>Equations</button>
                </div>
            )}
            {(isOpen && open.diagram) && (
                <div className="containerForm">
                    <button className="dashBtn" onClick={() => { setDiagramDisplay({ projectile: true }), setOpen((prev) => ({ ...prev, diagram: false }))}}>Projectile</button>
                    <button className="dashBtn" onClick={() => { setDiagramDisplay({ ramp: true }), setOpen((prev) => ({ ...prev, diagram: false }))}}>Ramp</button>
                    <button className="dashBtn" onClick={() => { setDiagramDisplay({ spring: true }), setOpen((prev) => ({ ...prev, diagram: false }))}}>Spring</button>
                    <button className="dashBtn" onClick={() => { setDiagramDisplay({ pendulum: true }), setOpen((prev) => ({ ...prev, diagram: false }))}}>Pendulum</button>
                </div>
            )}
            {(isOpen && diagramDisplay.projectile) && (
                <WEPDProj/>
            )}
            {(isOpen && diagramDisplay.ramp) && (
                <WEPDRamp/>
            )}
            {(isOpen && diagramDisplay.spring) && (
                <WEPDSpring/>
            )}
            {(isOpen && diagramDisplay.pendulum) && (
                <WEPDPend/>
            )}
            {(isOpen && open.graph) && (
                <div>
                    2
                </div>
            )}
            {(isOpen && open.eq) && (
                <div>
                    3
                </div>
            )}
        </div>
    );
}

export default DashWEP

