import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';

const ForceMatter = () => {
    const sceneRef = useRef(null);    

    useEffect(() => {

        window.addEventListener("forceCanvas", forceCanvasHS);

        window.addEventListener("fromKinBtn", otherHide);
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
                background: 'rgb(70, 44, 125)',
            },
        });

        const ball = Bodies.circle(380, 240, 10);
        const floor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});
        const rampPoints = [
            {x: 0, y: 700},
            {x: 0, y: 500},
            {x: 500, y: 700}
        ];
        const ramp = Bodies.fromVertices(500, 400, rampPoints, {isStatic: true});

        Composite.add(engine.world, [ball, floor, ramp]);
        
        const runner = Runner.create();
        Runner.run(runner,engine);
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
        top: "8vh",
    }
    
    return(
        <div className="physCanvas" style={canvasStyle}>
            <div ref={sceneRef}/>
        </div>
    );
}

export default ForceMatter;