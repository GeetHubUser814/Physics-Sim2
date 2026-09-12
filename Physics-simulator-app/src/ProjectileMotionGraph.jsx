import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function ProjectileMotionGraph() {
    const [projGraph, setProjGraph] = useState({
        velI: 10,
        elevation: 5,
        gravConst: 10
    }); 
    const g = projGraph.gravConst;
    const vI = projGraph.velI;
    const h = projGraph.elevation;
    const mafFunc = (x) => (0.5 * -g * x ** 2) + vI * x + h;
    const domainCutoff = () => ((-vI - Math.sqrt(vI ** 2 + 2 * g * h)) / -g)
    const coord = useMovablePoint([0, h], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, domainCutoff()));
            const yValue = mafFunc(clampedX);
            return [clampedX, yValue];
        }
    })
    const maxRange = domainCutoff();
    const peakHeight = (vI - g * maxRange) ** 2 / (2 * g);

    const handleInputChange = (e) =>{ 
        const {name, value, type} = e.target;

        const finalValue = type === 'range' ? Number(value) : value;
        setProjGraph((preProjGraph) => ({
            ...preProjGraph,
            [name]: finalValue,
        }));
    };

    useEffect(() => {
        if(coord.x > maxRange){
            coord.setPoint([maxRange, mafFunc(maxRange)])
        }
    }, [projGraph, maxRange]);

    return (
    <div>
        <div className="graphModContainer">
            <form className="graphMod">
                <label>
                    initial velocity({projGraph.velI} m/s): 
                </label>
                <input
                    type="range"
                    name="velI"
                    min="0"
                    max="50"
                    onChange={handleInputChange}
                    value={projGraph.velI}
                />
            </form>
            <form className="graphMod">
                <label>
                    elevation({projGraph.elevation} m): 
                </label>
                <input
                    type="range"
                    name="elevation"
                    min="0"
                    max="15"
                    onChange={handleInputChange}
                    value={projGraph.elevation}
                />
            </form>
            <form className="graphMod">
                <label>
                    acceleration due to gravity({projGraph.gravConst} m/s<sup>2</sup>): 
                </label>
                <input
                    type="range"
                    name="gravConst"
                    min="1"
                    max="20"
                    onChange={handleInputChange}
                    value={projGraph.gravConst}
                />
            </form>
       </div>
        <Mafs viewBox={{x: [0, Math.max(4, maxRange)], y: [-2, Math.max(2, peakHeight + 2)]}} height={500} width={1200}>
            <Coordinates.Cartesian />
            <Plot.OfX 
                y={mafFunc}
                domain={[0, domainCutoff()]}
                color={Theme.red}
            />
            <Text
                x={coord.x}
                y={coord.y}
            >
                ({coord.x.toFixed(2)}, {coord.y.toFixed(2)})
            </Text>
            <Text
                x={(peakHeight + 2) * 1.11 + 5}
                y={0.8}
            >time</Text>
            <Text
                x={-Math.max(2.5, 2.5 + peakHeight * 0.1)}
                y={Math.max((peakHeight + 2) - 1, 2.1)}
            >height</Text>
            {coord.element}
        </Mafs>
    </div>
    );
}
export default ProjectileMotionGraph