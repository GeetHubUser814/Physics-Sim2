import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';

const PhysicsCanvas = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(Matter.Engine.create());

    useEffect(() => {
        
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const Runner = Matter.Runner;
        const Bodies = Matter.Bodies;
        const Composite = Matter.Composite;
        
        const engine = Engine.create();

        const render = Render.create({
            
        });

        return () => {
            
        };
    }, []);


    return(
       <div></div> 
    );    
}