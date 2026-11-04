import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';
import { useRampStore } from './RampSimStore';

const ForceMatter = () => {
    const sceneRef = useRef(null);    
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const ballRef = useRef(null);
    const rampSimRef = useRef(null);
    const floorRef = useRef(null);

    const pulleyRef = useRef(null);
    const mass1Ref = useRef(null);
    const mass2Ref = useRef(null);
    const constraint1Ref = useRef(null);
    const constraint2Ref = useRef(null);
    const pivotRef = useRef(null);

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
    /*
    useEffect(() => {//communication 
        window.addEventListener("forceCanvas", forceCanvasHS);

        window.addEventListener("fromKinBtn", otherHide);
        window.addEventListener("fromWEPBtn", otherHide);
        window.addEventListener("fromLinearMBtn", otherHide);

        window.addEventListener("startEndSimRamp", rampSim);
        window.addEventListener("startEndSimAtwood", atwoodSim);

        window.addEventListener("openCanvasForce", forceCanvasHS);
        window.addEventListener("closeCanvasForce", () => {
            otherHide();
            canvasCover.current = false;
        });
        window.addEventListener("coverCanvasForce", () => {
            canvasCover.current = true;
        });
        window.addEventListener("coverDownCanvasForce", () => {
            canvasCover.current = false;
            forceCanvasHS();
        });

        return () => {
            window.removeEventListener("forceCanvas", forceCanvasHS);
            window.removeEventListener("fromKinBtn", otherHide);
            window.removeEventListener("fromWEPBtn", otherHide);
            window.removeEventListener("fromLinearMBtn", otherHide);
            window.removeEventListener("startEndSimRamp", rampSim);
            window.removeEventListener("startEndSimAtwood", atwoodSim);
            window.removeEventListener("openCanvasForce", forceCanvasHS);
            window.removeEventListener("closeCanvasForce", () => {
                otherHide();
                canvasCover.current = false;
            });
            window.removeEventListener("coverCanvasForce", () => {
                canvasCover.current = true;
            });
            window.removeEventListener("coverDownCanvasForce", () => {
                canvasCover.current = false;
                forceCanvasHS();
            });
        }
    }, [])
    */

    useEffect(() => {
        const {Engine, Render, Runner, Bodies, Composite, Constraint} = Matter;
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
        floorRef.current = floor;

        const pulleyCenter = {x: 400, y: 150};
        const pulley = Bodies.circle(pulleyCenter.x, pulleyCenter.y, 30, {
            frictionAir: 0.01,
        });
        pulleyRef.current = pulley;    
        const mass1 = Bodies.rectangle(350, 300, 40, 40, {
            density: 0.005,
        });
        const mass2 = Bodies.rectangle(450, 200, 40, 40, {
            density: 0.001,
        });
        const constraint1 = Constraint.create({
            pointA: {x: pulleyCenter.x - 20, y: pulleyCenter.y},
            bodyB: mass1,
            stiffness: 0.9,
            length: 150,
        });
        const constraint2 = Constraint.create({
            pointA: {x: pulleyCenter.x + 20, y: pulleyCenter.y},
            bodyB: mass2,
            stiffness: 0.9,
            length: 100,
        });
        const pivot = Constraint.create({
            pointA: pulleyCenter,
            bodyB: pulley,
            stiffness: 1,
            length: 0,
        });
        mass1Ref.current = mass1;
        mass2Ref.current = mass2;
        constraint1Ref.current = constraint1;
        constraint2Ref.current = constraint2;
        pivotRef.current = pivot;

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
                const newFloor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});
                const newPulley = Bodies.circle(400, 150, 0, {
                    isStatic: true,
                });

                Composite.remove(engineRef.current.world, [ballRef.current, rampSimRef.current, pulleyRef.current, floorRef.current]);
                Composite.add(engineRef.current.world, [newBall, newRamp, newPulley, newFloor]);
                ballRef.current = newBall;
                rampSimRef.current = newRamp;
                pulleyRef.current = newPulley;
                floorRef.current = newFloor;

                Runner.run(runnerRef.current, engineRef.current);


            }else if(isRunning.current){
                Matter.Runner.stop(runnerRef.current);
                //Matter.Engine.clear(engineRef.current);
            }
            isRunning.current = !isRunning.current;
        }else if(sim === "atwood"){
            isRamp.current = false;
            if(!runnerRef.current) return;
            const {Runner, Composite, Bodies, Constraint} = Matter;

            if(!isRunning.current){
                const pulleyCenter = {x: 400, y: 150};
                const newPulley = Bodies.circle(pulleyCenter.x, pulleyCenter.y, 30, {
                    frictionAir: 0.01,
                });
                const mass1 = Bodies.rectangle(350, 300, 40, 40, {
                    density: 0.005,
                });
                const mass2 = Bodies.rectangle(450, 200, 40, 40, {
                    density: 0.001,
                });
                const constraint1 = Constraint.create({
                    pointA: {x: pulleyCenter.x - 20, y: pulleyCenter.y},
                    bodyB: mass1,
                    stiffness: 0.9,
                    length: 150,
                });
                const constraint2 = Constraint.create({
                    pointA: {x: pulleyCenter.x + 20, y: pulleyCenter.y},
                    bodyB: mass2,
                    stiffness: 0.9,
                    length: 100,
                });
                const pivot = Constraint.create({
                    pointA: pulleyCenter,
                    bodyB: newPulley,
                    stiffness: 1,
                    length: 0,
                })

                const newBall = Bodies.circle(25, 456 - rampY.current, 0, {friction: rampRef.friction, frictionAir: 0, restitution: 0});
                const newRampPoints = [
                    {x: 0, y: 0},
                    {x: 0, y: 0},//bottom right pt
                    {x: 0, y: 0}
                ];
                const newRamp = Bodies.fromVertices(20 + rampX.current / 3, 464 - rampY.current / 3, newRampPoints, {isStatic: true});
                const newFloor = Bodies.rectangle(0, 0, 0, 0, {isStatic: true});

                Composite.remove(engineRef.current.world, [floorRef.current, ballRef.current, rampSimRef.current, pulleyRef.current, 
                    mass1Ref.current, mass2Ref.current, constraint1Ref.current, constraint2Ref.current, pivotRef.current
                ]);
                Composite.add(engineRef.current.world, [newPulley, newBall, newRamp, newFloor, mass1, mass2, constraint1, constraint2, pivot]);
                pulleyRef.current = newPulley;
                ballRef.current = newBall;
                rampSimRef.current = newRamp;
                floorRef.current = newFloor;
                mass1Ref.current = mass1;
                mass2Ref.current = mass2;
                constraint1Ref.current = constraint1;
                constraint2Ref.current = constraint2;
                pivotRef.current = pivot;

                Runner.run(runnerRef.current, engineRef.current);
            }else if(isRunning.current){
                Matter.Runner.stop(runnerRef.current);
            }
            isRunning.current = !isRunning.current;
        }
    };

    const canvasHidden = useRef(true);
    const canvasCover = useRef(false);
    const forceCanvasHS = () => {
        if(canvasHidden.current && !canvasCover.current){
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