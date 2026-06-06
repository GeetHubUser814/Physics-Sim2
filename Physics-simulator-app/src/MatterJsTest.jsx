import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const PhysicsSimulation = () => {
  const sceneRef = useRef(null);

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
        width: 400,
        height: 400,
        wireframes: false, // Set to false to see colors/textures
      },
    });

    // 4. Create bodies (a bouncing box and a static ground)
    const box = Bodies.rectangle(200, 200, 80, 80);
    const ground = Bodies.rectangle(300, 300, 800, 20, { isStatic: true });

    // Add all of the bodies to the world
    Composite.add(engine.world, [box, ground]);

    // 5. Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // 6. Cleanup on unmount
    return () => {
      Render.stop(render);
      Engine.clear(engine);
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default PhysicsSimulation;
