import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';

const LinearMMatter = () => {
    const sceneRef = useRef(null);    

    useEffect(() => {

        window.addEventListener("LinearMCanvas", LinearMCanvasHS);

        window.addEventListener("fromForceBtn", otherHide);
        window.addEventListener("fromKinBtn", otherHide);
        window.addEventListener("fromWEPBtn", otherHide);

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

        const ball1 = Bodies.circle(900, 200, 50);
        const ball2 = Bodies.circle(150, 200, 50);
        const floor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});

        Composite.add(engine.world, [ball1, ball2, floor]);
        
        const runner = Runner.create();
        Runner.run(runner,engine);
        Render.run(render);

        return () => {
            window.removeEventListener("LinearMCanvas", LinearMCanvasHS);
            Runner.stop(runner);
            Render.stop(render);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        }
    }, []);

    const canvasHidden = useRef(true);
    const LinearMCanvasHS = () => {
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

export default LinearMMatter;