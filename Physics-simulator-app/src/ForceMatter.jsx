import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';

const ForceMatter = () => {
    const sceneRef = useRef(null);    

    useEffect(() => {

        window.addEventListener("forceCanvas", forceCanvasHS);

        const {Engine, Render, Runner, Bodies, Composite} = Matter;

        const engine = Engine.create();

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: 1100,
                height: 500,
                wireframes: false,
                background: 'purple',
            },
        });

        const ball = Bodies.circle(500, 0, 10);
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

    const showHide = useRef(true);
    const forceCanvasHS = () => {
        console.log("forceTrig");
        if(showHide.current){
            showHide.current = false;
            const showHideKin = new CustomEvent("kinCanvas");
            window.dispatchEvent(showHideKin);
        }
        setCanvasDisplay(showHide.current);
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