import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point } from "mafs";
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
    const angle = projGraph.angleI;
    const vIY = (vI * (Math.sin((angle) * (Math.PI / 180))));
    const vIX = (vI * (Math.cos((angle) * (Math.PI / 180))));
    const mafFunc = (x) => (0.5 * -g * x ** 2) + vI * (Math.sin((angle) * (Math.PI / 180))) * x + h;
    const mafFuncVel = (x) => x * -g + vIY;
    const mafFuncAccel = (x) => -g;
    const mafFuncPosH = (x) => (x * vIX);
    const mafFuncVelH = (x) => vIX;
    const maxRange = ((-vIY - Math.sqrt(vIY ** 2 + 2 * g * h)) / -g)
    const coord = useMovablePoint([0, h], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            const yValue = mafFunc(clampedX);
            return [clampedX, yValue];
        }
    })
    const coordVel = useMovablePoint([0, vI], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            return [clampedX, -g * clampedX + vIY]
        }
    })
    const coordAccel = useMovablePoint([0, -g], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            return [clampedX, -g]
        }
    })
    const coordPos = useMovablePoint([0, 0], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            return [clampedX, clampedX * vIX]
        }
    })
    const coordVelH = useMovablePoint([0, vIX], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            return [clampedX, vIX]
        }
    })
    const coordAccelH = useMovablePoint([0, vIX], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            return [clampedX, 0]
        }
    })

    const peakHeight = (vIY ** 2) / (2 * g) + h;

    const handleInputChange = (e) =>{ 
        const {name, value, type} = e.target;

        const finalValue = type === 'range' ? Number(value) : value;
        setProjGraph((preProjGraph) => ({
            ...preProjGraph,
            [name]: finalValue,
        }));
    };

    const [graphShow, setGraphShow] = useState({
        heightGraph: true,
        velGraph: false,
        accelGraph: false,
        posGraphH: false,
        velGraphH: false,
        accelGraphH: false
    });
    const [showDot, setShowDot] = useState(true);
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

    const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.6, height: window.innerHeight * 0.5})
    useEffect(() => {
        window.addEventListener('resize', () => {
            setDimensions({
                width: window.innerWidth * 0.6,
                height: window.innerHeight * 0.5
            });
        });
    }, [])

    function repeatGraph(inputArray, viewX, viewY, xLabel, yLabel){
        const [clickedPoint, setClickedPoint] = useState(null);
        const clickError = 5;
        function clicked(point, event){
            if(Math.max(0, Math.min(point[0], maxRange)) === point[0] && (point[1] <= inputArray[0](point[0]) + clickError && point[1] >= inputArray[0](point[0]) - clickError)){
                setClickedPoint([point[0], inputArray[0](point[0])]);
            }
        }
        return(
            <div>
                    <div className="graphTitle">
                        <p>{yLabel} vs. {xLabel} graph</p>
                    </div>
                    <Mafs viewBox={{x: viewX, y: viewY}} width={dimensions.width} height={dimensions.height} zoom={{min: 0.01, max: 2}} pan={true} preserveAspectRatio={false} onClick={(point, event) => clicked(point, event)}>
                        <Coordinates.Cartesian 
                          xAxis={{
                                lines: 1,
                                labels: (n) => (n % 1 == 0 ? n : ""),
                            }}
                            yAxis={{
                                lines: 5,
                                labels: (n) => (n % 5 == 0 ? n : ""),
                            }}
                        />
                        <Plot.OfX 
                            y={inputArray[0]}
                            domain={inputArray[1]}
                            color={Theme.red}
                        />
                        {(clickedPoint) && (
                            <Text
                                x={clickedPoint[0]}
                                y={clickedPoint[1]}
                            >
                                ({clickedPoint[0].toFixed(2)}, {clickedPoint[1].toFixed(2)})
                            </Text>
                        )}
                        {(clickedPoint) && (
                            <Point
                                x={clickedPoint[0]}
                                y={clickedPoint[1]}
                                color={Theme.pink}
                            />
                        )}
                    </Mafs>
                    <div className="xLabel">x-axis: {xLabel}</div>
                    <div className="yLabel">y-axis: {yLabel}</div>
            </div>
        );
    }

    return (
    <div>
        {repeatGraphMod([
            ["initial velocity(m/s)", "velI", 0, 50, vI],
            ["elevation(m)", "elevation", 0, 15, h],
            ["acceleration due to gravity(m/s²)", "gravConst", 1, 20, g],
            ["angle of launch(deg)", "angleI", 0, 90, angle]
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
                [0, maxRange],
                coord],
                [0, 10],
                [-3, 20],
                "time",
                "position(vertical)"
            )
        )}
        {(graphShow.velGraph) && (
            repeatGraph(
                [mafFuncVel,
                [0, maxRange],
                coordVel],
                [0, 10],
                [-15, 15],
                "time",
                "velocity(vertical)"
            )
        )}
        {(graphShow.accelGraph) && (
            repeatGraph(
                [mafFuncAccel,
                [0, maxRange],
                coordAccel],
                [0, 10],
                [-12, 2],
                "time",
                "acceleration(vertical)"
            )
        )}
        {(graphShow.posGraphH) && (
            repeatGraph(
                [(mafFuncPosH),
                [0, maxRange],
                coordPos],
                [0, 10],
                [-3, 5],
                "time",
                "position(horizontal)"
            )
        )}
        {(graphShow.velGraphH) && (
            repeatGraph(
                [mafFuncVelH,
                [0, maxRange],
                coordVelH],
                [0, 10],
                [-3, 10],
                "time",
                "velocity(horizontal)"
            )
        )}
        {(graphShow.accelGraphH) && (
            repeatGraph(
                [(x) => 0,
                [0, maxRange],
                coordAccelH],
                [0, 10],
                [-2, 2],
                "time",
                "acceleration(horizontal)"
            )
        )}

    </div>
    );
}
export default ProjectileMotionGraph

    /*
                {inputArray.map((_, index) => (
                    <Mafs viewBox={{x: [0, Math.max(4, maxRange)], y: [-2, Math.max(2, peakHeight + 2)]}} height={500} width={1200}>
                        <Coordinates.Cartesian />
                        <Plot.OfX 
                            y={mafFunc}
                            domain={[0, maxRange]}
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