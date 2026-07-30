import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';

const KinematicsMatter = () => {
    const sceneRef = useRef(null);    

    useEffect(() => {

        window.addEventListener("kinCanvas", kinCanvasHS);

        window.addEventListener("fromForceBtn", otherHide);
        window.addEventListener("fromWEPBtn", otherHide);
        window.addEventListener("fromLinearMBtn", otherHide);

        const {Engine, Render, Runner, Bodies, Composite} = Matter;
        const engine = Engine.create();

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
        const ball = Bodies.circle(150, 200, 10);
        const floor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});
        const elevation = Bodies.rectangle(0, 400, 500, 400, {isStatic: true});

        Composite.add(engine.world, [ball, floor, elevation]);
        
        const runner = Runner.create();
        Runner.run(runner,engine);
        Render.run(render);

        return () => {
            window.removeEventListener("kinCanvas", kinCanvasHS);
            Runner.stop(runner);
            Render.stop(render);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        }
    }, []);

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