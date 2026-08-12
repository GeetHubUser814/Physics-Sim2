import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';
import { useProjectileStore } from './ProjectileSimStore';

const KinematicsMatter = () => {
    const sceneRef = useRef(null);  
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const ballRef = useRef(null);

    const [isRunning, setIsRunning] = useState(false);
    
    const storeProjectileSim = useProjectileStore((state) => state.projectileSim);

    useEffect(() => {

        window.addEventListener("kinCanvas", kinCanvasHS);

        window.addEventListener("fromForceBtn", otherHide);
        window.addEventListener("fromWEPBtn", otherHide);
        window.addEventListener("fromLinearMBtn", otherHide);

        window.addEventListener("startSimulation", startSimulation);
        window.addEventListener("endSimulation", endSimulation);

        const {Engine, Render, Runner, Bodies, Composite, Body} = Matter;
        const engine = Engine.create();
        engineRef.current = engine;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: 1100,
                height: 500,
                wireframes: false,
                background: 'rgb(105, 48, 174)',
            },
        });
        const runner = Runner.create();
        runnerRef.current = runner;

        const ball = Bodies.circle(150, 200, 10);
        const floor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});
        const elevation = Bodies.rectangle(0, 475, 500, storeProjectileSim.elevation, {isStatic: true});
        ballRef.current = ball;


        Composite.add(engine.world, [ball, floor, elevation]);
        Render.run(render);
        /*
        const runner = Runner.create();
        Runner.run(runner,engine);
        Render.run(render);
        */
        return () => {
            window.removeEventListener("kinCanvas", kinCanvasHS);
            Runner.stop(runner);
            Render.stop(render);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        }
    }, [storeProjectileSim.elevation]);

    const startSimulation = () => {
        if(isRunning) return;

        const{Runner, Body} = Matter;
        Body.setVelocity(ballRef.current, {x: 10, y: 0});
        Runner.run(runnerRef.current, engineRef.current);
        setIsRunning(true);
    };

    const endSimulation = () => {
        console.log("sim ended");

        const {Runner, Body} = Matter;
        Runner.stop(runnerRef.current);
        Body.setPosition(ballRef.current, {x: 150, y: 200});
        Body.setVelocity(ballRef.current, {x: 0, y: 0});
    }

    const canvasHidden = useRef(false);
    const kinCanvasHS = () => {
        if(canvasHidden.current){
            canvasHidden.current = false;
        }
        setCanvasDisplay(canvasHidden.current);
    };

    const otherHide = () => {
        if(!canvasHidden.current){
            canvasHidden.current = true;
        }
        setCanvasDisplay(canvasHidden.current);
    };

    const [isHidden, setCanvasDisplay] = useState(false);
    const canvasStyle = {
        display: isHidden ? "none" : "flex",
        justifyContent: "center",
        justifySelf: "center",
        position: "absolute",
        top: "8vh",
    }
    
    return(
        <div className="physCanvas" style={canvasStyle}>
            <div ref={sceneRef}/>
        </div>
    );
}

export default KinematicsMatter;