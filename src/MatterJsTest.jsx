import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';


const PhysicsSimulation = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create());

  const boxesRef = useRef([]);

  useEffect(() => {
    // 1. Module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;

    // 2. Create an engine
    const engine = Engine.create();

    // 3. Create a renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 600,
        height: 600,
        wireframes: false, // Set to false to see colors/textures
      },
    });
      
    // 4. Create bodies (a bouncing box and a static ground)
    const box1 = Bodies.rectangle(200, 200, 80, 80);
    const box2 = Bodies.rectangle(400, 200, 80, 80);
    const ground = Bodies.rectangle(300, 500, 800, 20, { isStatic: true });

    boxesRef.current = [box1, box2];

    // Add all of the bodies to the world
    Composite.add(engine.world, [...boxesRef.current, ground]);

    // 5. Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // 6. Cleanup on unmount
    return () => {
      Render.stop(render);
      Composite.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const scaleBoxes = (factor) => {
    boxesRef.current.forEach((box) => {
      Matter.Body.scale(box, factor, factor)
    })
  }

  return(
    <div className="physCanvas">
      <div ref={sceneRef}/>
      <div className="button-55">
        <button onClick={() => scaleBoxes(0.8)}>Smaller Boxes</button>
        <button onClick={() => scaleBoxes(1.2)}>Bigger Boxes</button>
      </div>
    </div>
  );
}

export default PhysicsSimulation;
