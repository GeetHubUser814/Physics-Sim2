import React, {useEffect, useRef} from 'react';
import Matter from 'matter-js';

const KinematicsMatter = () => {
    const sceneRef = useRef(null);

    useEffect(() => {
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

        const ball = Bodies.circle(150, 200, 10);
        const floor = Bodies.rectangle(550, 490, 1200, 50, {isStatic: true});
        const elevation = Bodies.rectangle(0, 400, 500, 400, {isStatic: true});

        Composite.add(engine.world, [ball, floor, elevation]);
        
        const runner = Runner.create();
        Runner.run(runner,engine);
        Render.run(render);

        return () => {
            Runner.stop(runner);
            Render.stop(render);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        }
    }, []);

    return(
        <div className="physCanvas">
            <div ref={sceneRef}/>
        </div>
    );
}

export default KinematicsMatter;