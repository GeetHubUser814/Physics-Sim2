import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point, Circle, Polygon, Vector, vec, LaTeX } from "mafs";
import React, { useEffect, useRef, useState } from 'react';
import Mather from './Mather';
import 'katex/dist/katex.min.css';

function WEPDSpring(){
    //canvas
    const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.7, height: window.innerHeight * 0.5 })
    useEffect(() => {
        window.addEventListener('resize', () => {
            setDimensions({
                width: window.innerWidth * 0.7,
                height: window.innerHeight * 0.5
            });
        });
    }, [])
    return(
        <div className="FBD-container">
            <Mafs width={dimensions.width} height={dimensions.height}>
                <Circle
                    center={[0, 0]}
                    radius={2}
                />
            </Mafs>
        </div>
    );
}
export default WEPDSpring