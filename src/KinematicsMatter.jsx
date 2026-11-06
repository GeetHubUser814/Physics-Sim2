import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useProjectileStore } from './ProjectileSimStore';
import { useOneDStore } from './OneDSimStore';

const KinematicsMatter = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const renderRef = useRef(null);
    const ballRef = useRef(null);
    const elevationRef = useRef(null);

    const isRunning = useRef(false);
    const isProj = useRef(true);

    const velocityValue = useRef(10);
    const elevationValue = useRef(30);
    const launchAngle = useRef(45);
    const grav = useRef(9.81);

    const odVelocityValue = useRef(10);
    const odAccelValue = useRef(5);
    const odAccelDirection = useRef(false);
    const odTimeValue = useRef(5);
    const odPrevTime = useRef(0);

    const storeProjectileSim = useProjectileStore((state) => state.projectileSim);
    const storeOneDSim = useOneDStore((state) => state.oneDSim);

    const hConst = 7.6;//higher equals higher h
    const vConst = 3.67 * 2;//higher equals less vel
    const gConst = 9.81 * 6.1 * 2;//higher equals less accel

    const oneDVConst = 10;//higher equals less vel
    const accelPower = 6.35;//higher equals less accel

    const projSim = () => startEndSim("proj");
    const oneDSim = () => startEndSim("oneD");

    const [canvasOpen, setCanvasOpen] = useState(true);

    useEffect(() => {
        window.addEventListener("kinCanvas", kinCanvasHS);

        window.addEventListener("fromForceBtn", otherHide);
        window.addEventListener("fromWEPBtn", otherHide);
        window.addEventListener("fromLinearMBtn", otherHide);

        window.addEventListener("startEndSimProj", projSim);
        window.addEventListener("startEndSimOneD", oneDSim);

        window.addEventListener("openCanvas", kinCanvasHS);
        window.addEventListener("closeCanvas", () => {
            otherHide();
            canvasCover.current = false;
        });
        window.addEventListener("coverCanvas", () => {
            canvasCover.current = true;
        });
        window.addEventListener("coverDownCanvas", () => {
            canvasCover.current = false;
            kinCanvasHS();
        });

        return () => {
            window.removeEventListener("kinCanvas", kinCanvasHS);
            window.removeEventListener("fromForceBtn", otherHide);
            window.removeEventListener("fromWEPBtn", otherHide);
            window.removeEventListener("fromLinearMBtn", otherHide);
            window.removeEventListener("startEndSimProj", projSim);
            window.removeEventListener("startEndSimOneD", oneDSim);
            window.removeEventListener("openCanvas", kinCanvasHS);
            window.removeEventListener("closeCanvas", () => {
                otherHide();
                canvasCover.current = false;
            });
            window.removeEventListener("coverCanvas", () => {
                canvasCover.current = true;
            });
            window.removeEventListener("coverDownCanvas", () => {
                canvasCover.current = false;
            });

        }
    }, []);

    const canvasWidth = window.innerWidth * 0.6;
    const canvasHeight = window.innerHeight * 0.5;
    const [cw, setCw] = useState(typeof window !== 'undefined' ? window.innerWidth * 0.6 : 0);
    const [ch, setCh] = useState(typeof window !== 'undefined' ? window.innerHeight * 0.5 : 0);
    useEffect(() => {
        function handleResize() {
            setCw(window.innerWidth * 0.6);
            setCh(window.innerHeight * 0.5);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const { Engine, Render, Runner, Bodies, Composite, Body } = Matter;
        const engine = Engine.create();
        engineRef.current = engine;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: canvasWidth,
                height: canvasHeight,
                wireframes: false,
                background: 'rgb(209, 165, 208)',
            },
        });
        renderRef.current = render;
        window.addEventListener('resize', () => {
            const newCanvasWidth = window.innerWidth * 0.6;
            const newCanvasHeight = window.innerHeight * 0.5;
            render.options.width = newCanvasWidth;
            render.options.height = newCanvasHeight;
            render.bounds.max.x = newCanvasWidth;
            render.bounds.max.y = newCanvasHeight;
            render.canvas.width = newCanvasWidth;
            render.canvas.height = newCanvasHeight;
            Matter.Render.setSize(render, newCanvasWidth, newCanvasHeight);
            Matter.Render.lookAt(render, {
                min: { x: 0, y: 0 },
                max: { x: 1250, y: 400 }
            });
        });
        Matter.Render.setSize(render, canvasWidth, canvasHeight);
        Matter.Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 1250, y: 400 }
        });
        const runner = Runner.create();
        runnerRef.current = runner;

        const handleBounce = (event) => {
            if (isProj.current) {
                Body.setStatic(ballRef.current, true);
            }
        }

        const oneDAccel = (event) => {
            if (!isProj.current) {
                Body.applyForce(ballRef.current, ballRef.current.position, {
                    x: odAccelDirection.current ? odAccelValue.current / (Math.pow(10, accelPower)) : -odAccelValue.current / (Math.pow(10, accelPower)),
                    y: 0,
                });
            }
        }

        Matter.Events.on(engine, 'collisionStart', handleBounce);
        Matter.Events.on(engine, 'beforeUpdate', oneDAccel);
        Matter.Events.on(engine, 'afterUpdate', () => {
            if (!isProj.current) {

                if (engine.timing.timestamp >= odTimeValue.current * 1000) {
                    Body.setStatic(ballRef.current, true);
                }
                if (ballRef.current.isStatic) {
                    engine.timing.timestamp = 0;
                    Runner.stop(runner);
                }
            }
        });

        const ball = Bodies.circle(103, 269 + 131 - elevationValue.current * hConst, 5, { frictionAir: 0, restitution: 0, render: { fillStyle: 'purple' } });
        const floor = Bodies.rectangle(550, 430, 1400, 50, { isStatic: true });
        const elevation = Bodies.rectangle(0, 405 - elevationValue.current * hConst / 2, 200, elevationValue.current * hConst, { isStatic: true });

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
        grav.current = storeProjectileSim.gravAcceleration;
    }, [storeProjectileSim.elevation, storeProjectileSim.velocity, storeProjectileSim.launchAngle, storeProjectileSim.gravAcceleration]);

    useEffect(() => {
        odVelocityValue.current = storeOneDSim.velocity;
        odAccelValue.current = storeOneDSim.acceleration;
        odAccelDirection.current = storeOneDSim.accelDirection;
        odTimeValue.current = storeOneDSim.time;
    }, [storeOneDSim.velocity, storeOneDSim.acceleration, storeOneDSim.accelDirection, storeOneDSim.time]);

    const trail = [];
    const trailX = useRef(1);
    const trailY = useRef(1);
    function startEndSim(sim) {
        if (sim === "proj") {
            isProj.current = true;
            if (!runnerRef.current) return;

            const { Runner, Composite, Bodies, Body } = Matter;

            if (!isRunning.current) {
                trail.length = 0;
                const newBall = Bodies.circle(103, 269 + 131 - elevationValue.current * hConst, 5, { frictionAir: 0, restitution: 0, render: { fillStyle: 'purple' } });
                const newElevation = Bodies.rectangle(0, 405 - elevationValue.current * hConst / 2, 200, elevationValue.current * hConst, { isStatic: true });

                engineRef.current.gravity.y = grav.current / (gConst);
                Body.setVelocity(newBall, {
                    x: velocityValue.current * Math.cos(launchAngle.current) / vConst,
                    y: velocityValue.current * Math.sin(launchAngle.current) * -1 / vConst
                });

                Composite.remove(engineRef.current.world, [ballRef.current, elevationRef.current]);
                Composite.add(engineRef.current.world, [newBall, newElevation]);
                ballRef.current = newBall;
                elevationRef.current = newElevation;

                Runner.run(runnerRef.current, engineRef.current);

                /*
                Matter.Events.on(engineRef.current, 'afterUpdate', () => {
                    if(isProj.current && !ballRef.current.isStatic){
                        trail.push({ x: ballRef.current.position.x, y: ballRef.current.position.y});
                    }
                });
                Matter.Events.on(renderRef.current, 'afterRender', () => {
                    const context = renderRef.current.context;
                    context.strokeStyle = 'blue';
                    context.beginPath();
                    for (let i = 0; i < trail.length; i++) {
                        context.lineTo(trail[i].x, trail[i].y);
                    }
                    context.stroke();
                });
                */


                const projStartX = 0.05;
                const projStartY = -8 * elevationValue.current / 1000 + 0.46;
                trail.length = 0;
                trailX.current = projStartX * window.innerWidth;
                trailY.current = projStartY * window.innerHeight;
                const context = renderRef.current.context;
                context.strokeStyle = 'blue';
                context.beginPath();
                for (let i = 0; i < 100; i++) {
                    trail.push({ x: trailX.current, y: trailY.current });
                    trailX.current += projStartX * window.innerWidth;
                    trailY.current = projStartY * window.innerHeight;
                }
                Matter.Events.on(renderRef.current, 'afterRender', () => {
                    const context = renderRef.current.context;
                    context.strokeStyle = 'blue';
                    context.beginPath();
                    for (let i = 0; i < trail.length; i++) {
                        context.lineTo(trail[i].x, trail[i].y);
                    }
                    context.stroke();
                    //5464
                });
                //resize
                window.addEventListener('resize', () => {
                    trail.length = 0;
                    trailX.current = projStartX * window.innerWidth;
                    trailY.current = projStartY * window.innerHeight;
                    const context = renderRef.current.context;
                    context.strokeStyle = 'blue';
                    context.beginPath();
                    for (let i = 0; i < 100; i++) {
                        trail.push({ x: trailX.current, y: trailY.current });
                        trailX.current += projStartX * window.innerWidth;
                        trailY.current = projStartY * window.innerHeight;
                    }
                    Matter.Events.on(renderRef.current, 'afterRender', () => {
                        const context = renderRef.current.context;
                        context.strokeStyle = 'blue';
                        context.beginPath();
                        for (let i = 0; i < trail.length; i++) {
                            context.lineTo(trail[i].x, trail[i].y);
                        }
                        context.stroke();
                        //5464
                    });
                    console.log(elevationValue.current);
                });
                /*
                trailX.current = 0.1 * window.innerWidth;
                trailY.current = 0.1 * window.innerHeight;
                for(let i = 0; i < 100; i++){
                    trail.push({ x: trailX.current, y: trailY.current});
                    trailX.current = i * window.innerWidth;
                    trailY.current = i * window.innerHeight;
                }
                Matter.Events.on(renderRef.current, 'afterRender', () => {
                    const context = renderRef.current.context;
                    context.strokeStyle = 'blue';
                    context.beginPath();
                    for (let i = 0; i < trail.length; i++) {
                        context.lineTo(trail[i].x, trail[i].y);
                    }
                    context.stroke();
                });
                */

            } else if (isRunning.current) {
                Matter.Runner.stop(runnerRef.current);
                //Matter.Engine.clear(engineRef.current);
            }

            isRunning.current = !isRunning.current;
        } else if (sim === "oneD") {
            isProj.current = false;
            engineRef.current.timing.timestamp = 0;
            if (!runnerRef.current) return;

            const { Runner, Composite, Bodies, Body, Render, Engine } = Matter;
            if (!isRunning.current) {
                const newBall = Bodies.circle(570, 421, 5, { friction: 0, frictionAir: 0, restitution: 0, render: { fillStyle: 'purple' } });
                const newElevation = Bodies.rectangle(0, 0, 0, 0, { isStatic: true });

                Body.setVelocity(newBall, {
                    x: odVelocityValue.current / oneDVConst,
                    y: 0,
                });

                Composite.remove(engineRef.current.world, [ballRef.current, elevationRef.current]);
                Composite.add(engineRef.current.world, [newBall, newElevation]);
                ballRef.current = newBall;
                elevationRef.current = newElevation;

                Runner.run(runnerRef.current, engineRef.current);

            } else if (isRunning.current) {
                Matter.Runner.stop(runnerRef.current);
                //Matter.Engine.clear(engineRef.current);
            }
            isRunning.current = !isRunning.current;
        }
    };


    const canvasHidden = useRef(false);
    const canvasCover = useRef(false);
    const kinCanvasHS = () => {
        if (canvasHidden.current && !canvasCover.current) {
            canvasHidden.current = false;
        }
        setCanvasDisplay(canvasHidden.current);
    };

    const otherHide = () => {
        if (!canvasHidden.current) {
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
        top: "4vh",
        left: "18vw",
    }



    return (
        <div className="physCanvas" style={canvasStyle}>
            <div ref={sceneRef} />
            {window.innerWidth}
            <br></br>
            {window.innerHeight}
            <br></br>
            {elevationValue.current}
        </div>
    );
}

export default KinematicsMatter;