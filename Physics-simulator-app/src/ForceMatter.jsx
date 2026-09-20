import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';
import { useRampStore } from './RampSimStore';

const ForceMatter = () => {
    const sceneRef = useRef(null);    
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const ballRef = useRef(null);
    const rampSimRef = useRef(null);

    const isRunning = useRef(false);
    const isRamp = useRef(true);

    const rampValues = useRef({
        angle: 30,
        length: 3000,
        vI: 45,
        friction: 0,
        topBottom: true,
    });
    const rampRef = rampValues.current;

    const storeRampSim = useRampStore((state) => state.rampSim);

    //sim consts
    const rampX = useRef(rampRef.length * Math.cos(rampRef.angle));
    const rampY = useRef(rampRef.length * Math.sin(rampRef.angle));

    useEffect(() => {//change based on store
        rampRef.angle = storeRampSim.angle * (Math.PI / 180);
        rampRef.length = storeRampSim.length;
        rampRef.vI = storeRampSim.vI;
        rampRef.friction = storeRampSim.friction;
        rampRef.topBottom = storeRampSim.topBottom;
        rampX.current = rampRef.length * Math.cos(rampRef.angle);
        rampY.current = rampRef.length * Math.sin(rampRef.angle);
    }, [storeRampSim.angle, storeRampSim.length, storeRampSim.vI, storeRampSim.friction, storeRampSim.topBottom]);



    const rampSim = () => startEndSim("ramp");
    const atwoodSim = () => startEndSim("atwood");
    useEffect(() => {//communication
        window.addEventListener("forceCanvas", forceCanvasHS);

        window.addEventListener("fromKinBtn", otherHide);
        window.addEventListener("fromWEPBtn", otherHide);
        window.addEventListener("fromLinearMBtn", otherHide);

        window.addEventListener("startEndSimRamp", rampSim);
        window.addEventListener("startEndSimAtwood", atwoodSim);

        return () => {
            window.removeEventListener("forceCanvas", forceCanvasHS);
            window.removeEventListener("fromKinBtn", otherHide);
            window.removeEventListener("fromWEPBtn", otherHide);
            window.removeEventListener("fromLinearMBtn", otherHide);
        }
    }, [])


    useEffect(() => {
        const {Engine, Render, Runner, Bodies, Composite} = Matter;
        const engine = Engine.create();
        engineRef.current = engine;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: 1100,
                height: 500,
                wireframes: false,
                background: 'rgb(70, 44, 125)',
            },
        });
        const runner = Runner.create();
        runnerRef.current = runner;

        const ball = Bodies.circle(25, 456 - rampY.current, 10, {friction: rampRef.friction, frictionAir: 0, restitution: 0});
        const floor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});
        const rampPoints = [
            {x: 0, y: 700},
            {x: rampX.current, y: 700},//bottom right pt
            {x: 0, y: 700 - rampY.current}
        ];

        const ramp = Bodies.fromVertices(20 + rampX.current / 3, 464 - rampY.current / 3, rampPoints, {isStatic: true, friction: 1});

        ballRef.current = ball;
        rampSimRef.current = ramp;

        Composite.add(engine.world, [ball, floor, ramp]);
        
        Render.run(render);

        return () => {
            window.removeEventListener("forceCanvas", forceCanvasHS);
            Runner.stop(runner);
            Render.stop(render);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        }
    }, []);

    function startEndSim(sim){
        if(sim === "ramp"){
            isRamp.current = true;
            if(!runnerRef.current) return;
            const {Runner, Composite, Bodies, Body} = Matter;

            if(!isRunning.current){
                const newBall = Bodies.circle(25, 456 - rampY.current, 10, {friction: rampRef.friction, frictionAir: 0, restitution: 0});
                const newRampPoints = [
                    {x: 0, y: 700},
                    {x: rampX.current, y: 700},//bottom right pt
                    {x: 0, y: 700 - rampY.current}
                ];
                const newRamp = Bodies.fromVertices(20 + rampX.current / 3, 464 - rampY.current / 3, newRampPoints, {isStatic: true});

                Composite.remove(engineRef.current.world, [ballRef.current, rampSimRef.current]);
                Composite.add(engineRef.current.world, [newBall, newRamp]);
                ballRef.current = newBall;
                rampSimRef.current = newRamp;

                Runner.run(runnerRef.current, engineRef.current);


            }else if(isRunning.current){
                Matter.Runner.stop(runnerRef.current);
                //Matter.Engine.clear(engineRef.current);
            }
            isRunning.current = !isRunning.current;
        }else if(sim === "atwood"){

        }
    };

    const canvasHidden = useRef(true);
    const forceCanvasHS = () => {
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


    const [isHidden, setCanvasDisplay] = useState(true);
    const canvasStyle = {
        display: isHidden ? "none" : "flex",
        justifyContent: "center",
        justifySelf: "center",
        position: "absolute",
        top: "4vh",
    }
    
    return(
        <div className="physCanvas" style={canvasStyle}>
            <div ref={sceneRef}/>
        </div>
    );
}

export default ForceMatter;