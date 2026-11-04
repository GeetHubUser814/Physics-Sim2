import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function OneDMotionGraph() {
    const [oneDGraph, setOneDGraph] = useState({
        position: 0,
        velI: 5,
        accel: 2,
        time: 10
    }); 
    const pos = oneDGraph.position;
    const vI = oneDGraph.velI;
    const accel = oneDGraph.accel;
    const time = oneDGraph.time;
    const posFunc = (x) => ((pos) + (vI * x + 0.5 * accel * x ** 2));
    const velFunc = (x) => (vI + x * accel);
    const accelFunc = (x) => (accel);
    const maxRange = time;
    const vertexTime = accel == 0 ? 2 : -vI / accel;

    

    const coordPos = useMovablePoint([0, pos], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            const yValue = posFunc(clampedX);
            return [clampedX, yValue];
        }
    })
    const coordVel = useMovablePoint([0, vI], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            const yValue = velFunc(clampedX);
            return [clampedX, yValue];
        }
    })
    const coordAccel = useMovablePoint([0, accel], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            const yValue = accelFunc(clampedX);
            return [clampedX, yValue];
        }
    })

    const handleInputChange = (e) =>{ 
        const {name, value, type} = e.target;

        const finalValue = type === 'range' ? Number(value) : value;
        setOneDGraph((preProjGraph) => ({
            ...preProjGraph,
            [name]: finalValue,
        }));
    };





    const [graphShow, setGraphShow] = useState({
        heightGraph: true,
        velGraph: false,
        accelGraph: false,
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
            ["initial position(m)", "position", -50, 50, pos],
            ["initial velocity(m/s)", "velI", -10, 10, vI],
            ["acceleration(m/s²)", "accel", -10, 10, accel],
            ["time(s)", "time", 0, 20, time]
        ])}

        <div className="graphSelecter">
            <button className="graphSelecterBtn" onClick={() => changeGraph("heightGraph")}>position vs time</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("velGraph")}>velocity vs time</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("accelGraph")}>acceleration vs time</button>
        </div>
        {(graphShow.heightGraph) && (
            repeatGraph(
                [posFunc,
                [0, maxRange],
                coordPos],
                [-2, maxRange + 20],
                [Math.min(pos - 3, posFunc(vertexTime) - 3, posFunc(maxRange) * 1.05, -2), Math.max(pos + 3, posFunc(vertexTime) + 3, posFunc(maxRange) * 1.05, 2)],
                "time",
                "position"
            )
        )}
        {(graphShow.velGraph) && (
            repeatGraph(
                [velFunc,
                [0, maxRange],
                coordVel,
                (10),
                0.8],
                [-2, maxRange],
                [Math.min(vI - 3, velFunc(maxRange) - 3, -2), Math.max(vI + 3, velFunc(maxRange) + 3, 2)],
                "time",
                "velocity"
            )
        )}
        {(graphShow.accelGraph) && (
            repeatGraph(
                [accelFunc,
                [0, maxRange],
                coordAccel],
                [-2, maxRange],
                [Math.min(accel - 3, -2), Math.max(accel + 3, 2)],
                "time",
                "acceleration"
            )
        )}
    </div>
    );
}
export default OneDMotionGraph
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