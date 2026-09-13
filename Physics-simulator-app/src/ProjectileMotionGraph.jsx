import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function ProjectileMotionGraph() {
    const [projGraph, setProjGraph] = useState({
        velI: 10,
        elevation: 5,
        gravConst: 10,
        angleI: 90
    }); 
    const g = projGraph.gravConst;
    const vI = projGraph.velI;
    const h = projGraph.elevation;
    const vIY = (vI * (Math.sin((projGraph.angleI) * (Math.PI / 180))));
    const vIX = (vI * (Math.cos((projGraph.angleI) * (Math.PI / 180))));
    const mafFunc = (x) => (0.5 * -g * x ** 2) + vI * (Math.sin((projGraph.angleI) * (Math.PI / 180))) * x + h;
    const mafFuncVel = (x) => x * -g + vIY;
    const mafFuncAccel = (x) => -g;
    const domainCutoff = () => ((-vIY - Math.sqrt(vIY ** 2 + 2 * g * h)) / -g)
    const coord = useMovablePoint([0, h], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, domainCutoff()));
            const yValue = mafFunc(clampedX);
            return [clampedX, yValue];
        }
    })
    const coordVel = useMovablePoint([0, vI], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, x)
            return [clampedX, -g * clampedX + vI]
        }
    })
    const coordAccel = useMovablePoint([0, -g], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, x)
            return [clampedX, -g]
        }
    })
    const maxRange = domainCutoff();
    const peakHeight = (vIY ** 2) / (2 * g) + h;

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



    const [graphShow, setGraphShow] = useState({
        heightGraph: true,
        velGraph: false,
        accelGraph: false,
        posGraphH: false,
        velGraphH: false,
        accelGraphH: false
    });
    function changeGraph(e){
        if(e === "velGraph"){
            setGraphShow((prev) => ({
                ...false,
                velGraph: true
            }))
        }else if(e === "heightGraph"){
            setGraphShow((prev) => ({
                ...false,
                heightGraph: true
            }))
        }else if(e === "accelGraph"){
            setGraphShow((prev) => ({
                ...false,
                accelGraph: true
            }))
        }else if(e === "posGraphH"){
            setGraphShow((prev) => ({
                ...false,
                posGraphH: true
            }))
        }else if(e === "velGraphH"){
            setGraphShow((prev) => ({
                ...false,
                velGraphH: true
            }))
        }else{
            setGraphShow((prev) => ({
                ...false,
                accelGraphH: true
            }))
        }
    } 
    function repeatGraphMod(inputArray){
        return(
            <div className="graphModContainer">
                {inputArray.map((_, rowIndex) => (
                <form className="graphMod" key={rowIndex}>
                    <label>
                        {inputArray[rowIndex][0]}: {inputArray[rowIndex][4]} 
                    </label>
                    <input
                        type="range"
                        name={inputArray[rowIndex][1]}
                        min={inputArray[rowIndex][2]}
                        max={inputArray[rowIndex][3]}
                        onChange={handleInputChange}
                        value={inputArray[rowIndex][4]}
                    />
                </form>
                ))}
            </div>
        );
    }
    /*
                {inputArray.map((_, index) => (
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
                        >position</Text>
                        {coord.element}
                    </Mafs>
                ))}
    */
    function repeatGraph(inputArray, viewX, viewY){
        return(
            <div>
                    <Mafs viewBox={{x: viewX, y: viewY}} height={500} width={1200}>
                        <Coordinates.Cartesian />
                        <Plot.OfX 
                            y={inputArray[0]}
                            domain={inputArray[1]}
                            color={Theme.red}
                        />
                        <Text
                            x={inputArray[2].x}
                            y={inputArray[2].y}
                        >
                            ({inputArray[2].x.toFixed(2)}, {inputArray[2].y.toFixed(2)})
                        </Text>
                        <Text
                            x={inputArray[3]}
                            y={inputArray[4]}
                        >{inputArray[5]}</Text>
                        <Text
                            x={inputArray[6]}
                            y={inputArray[7]}
                        >{inputArray[8]}</Text>
                        {inputArray[2].element}
                    </Mafs>
              
            </div>
        );
    }
    return (
    <div>
        {repeatGraphMod([
            ["initial velocity(m/s)", "velI", 0, 50, projGraph.velI],
            ["elevation(m)", "elevation", 0, 15, projGraph.elevation],
            ["acceleration due to gravity(m/s²)", "gravConst", 1, 20, projGraph.gravConst],
            ["angle of launch(deg)", "angleI", 0, 90, projGraph.angleI]
        ])}

        <div className="graphSelecter">
            <button className="graphSelecterBtn" onClick={() => changeGraph("heightGraph")}>position vs time (vertical)</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("velGraph")}>velocity vs time (vertical)</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("accelGraph")}>acceleration vs time (vertical)</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("posGraphH")}>position vs time (horizontal)</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("velGraphH")}>velocity vs time (horizontal)</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("accelGraphH")}>acceleration vs time (horizontal)</button>
        </div>
        {(graphShow.heightGraph) && (
            repeatGraph(
                [mafFunc,
                [0, domainCutoff()],
                coord,
                ((peakHeight + 2) * 1.11 + 5),
                0.8,
                "time",
                (-Math.max(2.5, 2.5 + peakHeight * 0.1)),
                (Math.max((peakHeight + 2) - 1, 2.1)),
                "position"],
                [0, Math.max(4, maxRange)],
                [-2, Math.max(2, peakHeight + 2)]
            )
        )}
        {(graphShow.velGraph) && (
            repeatGraph(
                [mafFuncVel,
                [-10000000, 100000000],
                coordVel,
                (Math.max(vIY * 1.8 + 19 + g, 20 + 1.4 * g)),
                0.8,
                "time",
                (1.5 + Math.max(vIY * 0.2, 0.1 * g)),
                (vIY + 3),
                "velocity"],
                [-1, 20 + g * 1.5 + vIY * 1.5],
                [-5 - 0.5 * g, vIY + 4]
            )
        )}
        {(graphShow.accelGraph) && (
            repeatGraph(
                [mafFuncAccel,
                [-10000000, 100000000],
                coordAccel,
                (Math.max(20, 2 * g + 18)),
                0.8,
                "time",
                (3 + 0.25 * g),
                (-4.2 - 0.9 * g),
                "acceleration"],
                [-1, 20 + 2 * g],
                [-g - 2, 2]
            )
        )}
        {(graphShow.posGraphH) && (
            repeatGraph(
                [mafFunc,
                [0, domainCutoff()],
                coord,
                ((peakHeight + 2) * 1.11 + 5),
                0.8,
                "time",
                (-Math.max(2.5, 2.5 + peakHeight * 0.1)),
                (Math.max((peakHeight + 2) - 1, 2.1)),
                "position"],
                [0, Math.max(4, maxRange)],
                [-2, Math.max(2, peakHeight + 2)]
            )
        )}
        {(graphShow.velGraphH) && (
            repeatGraph(
                [mafFuncVel,
                [-10000000, 100000000],
                coordVel,
                (Math.max(vI * 1.8 + 19 + g, 20 + 1.4 * g)),
                0.8,
                "time",
                (1.5 + Math.max(vI * 0.2, 0.1 * g)),
                (vI + 3),
                "velocity"],
                [-1, 20 + g * 1.5 + vI * 1.5],
                [-5 - 0.5 * g, vI + 4]
            )
        )}
        {(graphShow.accelGraphH) && (
            repeatGraph(
                [mafFuncAccel,
                [-10000000, 100000000],
                coordAccel,
                (Math.max(20, 2 * g + 18)),
                0.8,
                "time",
                (3 + 0.25 * g),
                (-4.2 - 0.9 * g),
                "acceleration"],
                [-1, 20 + 2 * g],
                [-g - 2, 2]
            )
        )}
    </div>
    );
}
export default ProjectileMotionGraph