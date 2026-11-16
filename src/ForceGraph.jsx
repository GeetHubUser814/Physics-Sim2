import { Mafs, Coordinates, Plot, Theme, useMovablePoint, Line, Text, Point } from "mafs";
import React, {useEffect, useRef, useState} from 'react';

function ForceGraph(){
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
    const mafFunc = (x) => vI * x;

    const maxRange = ((-vIY - Math.sqrt(vIY ** 2 + 2 * g * h)) / -g);
    const coord = useMovablePoint([0, h], {
        constrain: ([x]) => {
            const clampedX = Math.max(0, Math.min(x, maxRange));
            const yValue = mafFunc(clampedX);
            return [clampedX, yValue];
        }
    })

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
                        step={inputArray[rowIndex][5]}
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

    function repeatGraph(inputArray, viewX, viewY, xLabel, yLabel, xLines, yLines){
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
                    <Mafs viewBox={{x: viewX, y: viewY}} width={dimensions.width} height={dimensions.height} zoom={{min: 0.000001, max: 1000}} pan={true} preserveAspectRatio={false} onClick={(point, event) => clicked(point, event)}>
                        <Coordinates.Cartesian 
                          xAxis={{
                                lines: xLines,
                                labels: (n) => (n % xLines == 0 ? n : ""),
                            }}
                            yAxis={{
                                lines: yLines,
                                labels: (n) => (n % yLines == 0 ? n : ""),
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
                    <div className="graphLabels">
                        <div>x-axis: {xLabel}</div>
                        <div>y-axis: {yLabel}</div>
                    </div>
            </div>
        );
    }

    return (
    <div>
        <div className="graphSelecter">
            <button className="graphSelecterBtn" onClick={() => changeGraph("heightGraph")}>spring force vs displacement</button>
            <button className="graphSelecterBtn" onClick={() => changeGraph("velGraph")}>net force vs acceleration</button>
        </div>
        {(graphShow.heightGraph) && (
            <>
            {repeatGraph(
                [mafFunc,
                [-h, h],
                coord],
                [-10, 10],
                [-1000, 1000],
                "displacement",
                "spring force",
                1,
                200
            )}
            {repeatGraphMod([
                ["spring constant", "velI", 10, 1000, vI],
                ["max displacement", "elevation", 0.5, 5, h, 0.1]
            ])}
            </>
        )}
        {(graphShow.velGraph) && (
            <>
            {repeatGraph(
                [mafFunc,
                [-10000, 10000],
                coord],
                [-100, 100],
                [-100, 100],
                "acceleration",
                "net force",
                5,
                10
            )}
            {repeatGraphMod([
                ["mass", "velI", 1, 50, vI],
            ])}
            </>
        )}
    </div>
    );
}
export default ForceGraph