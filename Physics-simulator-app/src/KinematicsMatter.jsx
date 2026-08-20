import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';
import { useProjectileStore } from './ProjectileSimStore';
import { useOneDStore } from './OneDSimStore';

const KinematicsMatter = () => {
    const sceneRef = useRef(null);  
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const ballRef = useRef(null);
    const elevationRef = useRef(null);

    const isRunning = useRef(false);
    const velocityValue = useRef(10);
    const elevationValue = useRef(400);
    const launchAngle = useRef(45);
    
    const storeProjectileSim = useProjectileStore((state) => state.projectileSim);
    const storeOneDSim = useOneDStore((state) => state.oneDSim);

    useEffect(() => {
        window.addEventListener("kinCanvas", kinCanvasHS);

        window.addEventListener("fromForceBtn", otherHide);
        window.addEventListener("fromWEPBtn", otherHide);
        window.addEventListener("fromLinearMBtn", otherHide);

        window.addEventListener("startEndSim", startEndSim);

        //window.addEventListener("submitValues", submitValues);

        return () => {
            window.removeEventListener("kinCanvas", kinCanvasHS);
            window.removeEventListener("fromForceBtn", otherHide);
            window.removeEventListener("fromWEPBtn", otherHide);
            window.removeEventListener("fromLinearMBtn", otherHide);
            window.removeEventListener("startEndSim", startEndSim);
            //window.removeEventListener("submitValues", submitValues);
        }
    }, []);

    useEffect(() => {
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

        const handleBounce = (event) => {
            Body.setStatic(ballRef.current, true);
        }

        Matter.Events.on(engine, 'collisionStart', handleBounce)

        const ball = Bodies.circle(240, 265 + 200 - elevationValue.current / 2, 10, {frictionAir: 0, restitution: 0});
        const floor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});
        const elevation = Bodies.rectangle(0, 475, 500, elevationValue.current, {isStatic: true});
        
        ballRef.current = ball;
        elevationRef.current = elevation;

        Composite.add(engine.world, [ball, floor, elevation]);
        Render.run(render);
        return () => {
            Matter.Events.off(engine, 'collisionStart', handleBounce);
            Runner.stop(runner);
            Render.stop(render);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        }
    }, []);

    useEffect(() => {
        elevationValue.current = storeProjectileSim.elevation;
        velocityValue.current = storeProjectileSim.velocity;
        launchAngle.current = storeProjectileSim.launchAngle * (Math.PI / 180);
    }, [storeProjectileSim.elevation, storeProjectileSim.velocity, storeProjectileSim.launchAngle]);

    function startEndSim(){
        if(!runnerRef.current) return;

        const {Runner, Composite, Bodies, Body} = Matter;

        if(!isRunning.current){
            const newBall = Bodies.circle(240, 265 + 199 - elevationValue.current / 2, 10, {frictionAir: 0, restitution: 0});
            const newElevation = Bodies.rectangle(0, 475, 500, elevationValue.current, {isStatic: true});
            Body.setVelocity(newBall, {
                x: velocityValue.current * Math.cos(launchAngle.current),
                y: velocityValue.current * Math.sin(launchAngle.current) * -1
            });

            Composite.remove(engineRef.current.world, [ballRef.current, elevationRef.current]);
            Composite.add(engineRef.current.world, [newBall, newElevation]);
            ballRef.current = newBall;
            elevationRef.current = newElevation;

            Runner.run(runnerRef.current, engineRef.current);

        }else if(isRunning.current){
            Matter.Runner.stop(runnerRef.current);
            //Matter.Engine.clear(engineRef.current);
        }
        isRunning.current = !isRunning.current;
    };

    /*
    function submitValues(){

    }
    */

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
            <div>{storeOneDSim.velocity},{storeOneDSim.acceleration},{storeOneDSim.accelDirection}</div>
        </div>
    );
}

export default KinematicsMatter;