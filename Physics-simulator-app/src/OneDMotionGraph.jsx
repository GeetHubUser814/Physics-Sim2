import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function OneDMotionGraph() {
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



    const [graphShow, setGraphShow] = useState({
        heightGraph: true,
        velGraph: false,
        accelGraph: false
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
        }else{
            setGraphShow((prev) => ({
                ...false,
                accelGraph: true
            }))
        }
    } 
    function repeatGraphMod(inputArray){
        return(
            <div className="graphModContainer">
                {inputArray.map((_, rowIndex) => (
                <form className="graphMod">
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
    return (
    <div>
        {repeatGraphMod([
            ["initial velocity(m/s)", "velI", 0, 50, projGraph.velI],
            ["elevation(m)", "elevation", 0, 15, projGraph.elevation],
            ["acceleration due to gravity(m/s²)", "gravConst", 1, 20, projGraph.gravConst]
        ])}

        <div className="graphSelecter">
            <button className="graphSelecterBtn" onClick={() => changeGraph("heightGraph")}>height vs time</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("velGraph")}>velocity vs time</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("else")}>acceleration vs time</button>
        </div>
        {(graphShow.heightGraph) && (
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
        )}
        {(graphShow.velGraph) && (
            <Mafs viewBox={{x: [-1, 20 + g * 1.5 + vI * 1.5], y: [-5 - 0.5 * g, vI + 4]}} height={500} width={1200}>
                <Coordinates.Cartesian />
                <Plot.OfX 
                    y={(x) => x * -g + vI}
                    color={Theme.red}
                />
                <Text
                    x={coordVel.x}
                    y={coordVel.y}
                >
                    ({coordVel.x.toFixed(2)}, {coordVel.y.toFixed(2)})
                </Text>
                <Text
                    x={Math.max(vI * 1.8 + 19 + g, 20 + 1.4 * g)}
                    y={0.8}
                >time</Text>
                <Text
                    x={1.5 + Math.max(vI * 0.2, 0.1 * g)}
                    y={vI + 3}
                >velocity</Text>
                {coordVel.element}
            </Mafs>
        )}
        {(graphShow.accelGraph) && (
            <Mafs viewBox={{x: [-1, 20 + 2 * g], y: [-g - 2, 2]}} height={500} width={1200}>
                <Coordinates.Cartesian />
                <Plot.OfX 
                    y={(x) => -g}
                    color={Theme.red}
                />
                <Text
                    x={coordAccel.x}
                    y={coordAccel.y}
                >
                    ({coordAccel.x.toFixed(2)}, {coordAccel.y.toFixed(2)})
                </Text>
                <Text
                    x={Math.max(20, 2 * g + 18)}
                    y={0.8}
                >time</Text>
                <Text
                    x={3 + 0.25 * g}
                    y={-4.2 - 0.9 * g}
                >acceleration</Text>
                {coordAccel.element}
            </Mafs>
        )}
    </div>
    );
}
export default OneDMotionGraph