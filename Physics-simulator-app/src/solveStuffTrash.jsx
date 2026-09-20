/*
Projectile Motion-
    elevation, velocity, angle of launch, acceleration due to gravity
1D Motion-
    velocity, acceleration, acceleration in the same direction of velocity, time
Sovle-
    Projectile-
        range, max height, time in the air, initial velocity, final velocity, angle of launch
    1D Motion-
        Displacement, Distance, Time, Initial Velocity, Final Velocity, Acceleration



            <div className="submitReceipt">
                <p>elevation: {submitReceipt.elevation}</p>
                <p>velocity:{submitReceipt.velocity}</p>
                <p>mass:{submitReceipt.mass}</p>
                <p>angle of launch:{submitReceipt.launchAngle}</p>
                <p>acceleration due to gravity:{submitReceipt.gravAcceleration}</p>
            </div>

            <button className="submitBtn" type="submit">Submit</button>
*/
/*
{(isOpen && isOpenSolve) && (
                <div className="containerForm containerSolve">
                    <div className="solveDiv">
                        <button onClick={projSolveBtn}>projectile motion</button>
                    </div>
                    <div className="solveDiv">
                        <button onClick={oneDSolveBtn}>1d motion</button>
                    </div>
                </div>
            )}
            {(isOpen && isOpenSolveProjectile) && (
                repeatSolveBtn([
                    ["range", "range"],
                    ["max height", "max height"],
                    ["time", "time in the air"],
                    ["velI", "initial velocity"],
                    ["velF", "final velocity"],
                    ["angleI", "angle of launch"],
                    ["angleF", "angle of impact"]
                ])
            )}

            
            {(isOpen && isOpenSolveProjectile) && (
                <div className="solvePopup">
                    <form className="solveContainerForm" onSubmit={handleSubmitSolve}>

                        {repeatSolveInput([
                            ["initial velocity", "velI", solveProj.velI],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "range")}
                       
                        {repeatSolveInput([
                            ["initial vertical velocity", "velIY", solveProj.velIY],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "max height")}

                        {repeatSolveInput([
                            ["initial vertical velocity", "velIY", solveProj.velIY],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "time")}
                        {/* INITIAL 
                        VELOCITY
                        {solveOptionBtn([
                            ["velIOptionOne", "solve inputs: t, θ(i), h, g"],
                            ["velIOptionTwo", "solve inputs: t, θ(i), v(f), g"],
                            ["velIOptionThree", "solve inputs: v(f), θ(i), h, g"]
                        ], "velI")}
                        {repeatSolveInput([
                            ["time in air", "time", solveProj.time],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velIOptionOne")} 
                        {repeatSolveInput([
                            ["time in air", "time", solveProj.time],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["final vertical velocity", "velFY", solveProj.velFY],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velIOptionTwo")} 
                        {repeatSolveInput([
                            ["final vertical velocity", "velFY", solveProj.velFY],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velIOptionThree")} 
                        {/* INITIAL 
                        VELOCITY 

                        {repeatSolveInput([
                            ["initial velocity", "velI", solveProj.velI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "velF")}
                        {/* INITIAL
                         ANGLE 
                        {solveOptionBtn([
                            ["angleIOptionOne", "solve inputs: v(i)(x), v(i)(y)"],
                            ["angleIOptionTwo", "solve inputs: v(i), v(f), h, g"]
                        ], "angleI")}
                        {repeatSolveInput([
                            ["initial horizontal velocity", "velIX", solveProj.velIX],
                            ["initial vertical velocity", "velIY", solveProj.velIY]
                        ], "angleIOptionOne")} 
                        {repeatSolveInput([
                            ["initial velocity", "velIX", solveProj.velIX],
                            ["final vertical velocity", "velFY", solveProj.velFY],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "angleIOptionTwo")} 
                        {/* INITIAL
                         ANGLE 

                        {repeatSolveInput([
                            ["initial velocity", "velI", solveProj.velI],
                            ["launch angle", "angleI", solveProj.angleI],
                            ["elevation", "elevation", solveProj.elevation],
                            ["acceleration due to gravity", "accel", solveProj.accel]
                        ], "angleF")}
                        <button className="dashBtn" type="submit">Submit</button>
                    </form>
                    {repeatDisplay([
                        ["answer", (subProj === "range" ? solveProjAnswer.range : 
                            (subProj === "max height" ? solveProjAnswer.max_height : 
                                (subProj === "time" ? solveProjAnswer.time : 
                                    (subProj === "velIOptionOne"  ? solveProjAnswer.velI : 
                                        (subProj === "velF" ? solveProjAnswer.velF : 
                                            (subProj === "angleI" ? solveProjAnswer.angleI : 
                                                (subProj === "angleF" ? solveProjAnswer.angleF : 
                                                    (subProj === "velIOptionTwo" ? solveProjAnswer.velI :
                                                        (subProj === "velIOptionThree" ? solveProjAnswer.velI : 
                                                            (subProj === "angleIOptionOne" ? solveProjAnswer.angleI : (
                                                                subProj === "angleIOptionTwo" ? solveProjAnswer.angleI : 0
                                                            )))))))))))],
                        ["skills used", (subProj === "range" ? rangeSkills : 
                            (subProj === "max height" ? maxHeightSkills : 
                                (subProj === "time" ? timeSkills : 
                                    (subProj === "velIOptionOne"  ? velISkillsOne : 
                                        (subProj === "velF" ? velFSkills : 
                                            (subProj === "angleI" ? angleISkillsOne : 
                                                (subProj === "angleF" ? angleFSkills : 
                                                    (subProj === "velIOptionTwo" ? velISkillsTwo :
                                                        (subProj === "velIOptionThree" ? velISkillsThree : 
                                                            (subProj === "angleIOptionOne" ? angleISkillsOne : (
                                                                subProj === "angleIOptionTwo" ? angleISkillsTwo : 0
                                                            )))))))))))],
                        ["steps", (subProj === "range" ? rangeSteps : 
                            (subProj === "max height" ? maxHeightSteps : 
                                (subProj === "time" ? timeSteps : 
                                    (subProj === "velIOptionOne"  ? velIStepsOne : 
                                        (subProj === "velF" ? velFSteps : 
                                            (subProj === "angleI" ? angleIStepsOne : 
                                                (subProj === "angleF" ? angleFSteps : 
                                                    (subProj === "velIOptionTwo" ? velIStepsTwo :
                                                        (subProj === "velIOptionThree" ? velIStepsThree : 
                                                            (subProj === "angleIOptionOne" ? angleIStepsOne : (
                                                                subProj === "angleIOptionTwo" ? angleIStepsTwo : 0
                                                            )))))))))))],
                        ["proportionality", (subProj === "range" ? rangeProp : 
                            (subProj === "max height" ? maxHeightProp : 
                                (subProj === "time" ? timeProp : 
                                    (subProj === "velIOptionOne"  ? velIPropOne : 
                                        (subProj === "velF" ? velFProp : 
                                            (subProj === "angleI" ? angleIPropOne : 
                                                (subProj === "angleF" ? angleFProp : 
                                                    (subProj === "velIOptionTwo" ? velIPropTwo :
                                                        (subProj === "velIOptionThree" ? velIPropThree : 
                                                            (subProj === "angleIOptionOne" ? angleIPropOne : (
                                                                subProj === "angleIOptionTwo" ? angleIPropTwo : 0
                                                            )))))))))))]
                    ], "solveAnswers")}
                </div>
            )}            


                const handleSubmitSolve = (e) => {
        e.preventDefault();

        if(subProj === "range"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                range: 
                Math.round((
                    (((-solveProj.velI * Math.round((Math.sin(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant) - 
                    Math.sqrt(Math.pow(solveProj.velI * (Math.round((Math.sin(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) - 4 * (-solveProj.accel / 2) * (solveProj.elevation))) / -solveProj.accel) * 
                    (solveProj.velI * Math.round((Math.cos(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant)
                ) * 1000) / 1000
            }));
        }
        if(subProj === "max height"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                max_height: 
                Math.round(((
                    -Math.pow(-solveProj.velIY, 2)
                ) / (2 * -9.81) + solveProj.elevation) * 1000) / 1000
            }));
        }
        if(subProj === "time"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                time:
                Math.round((
                    ((-solveProj.velIY) - 
                    Math.sqrt(Math.pow(solveProj.velIY, 2) - 4 * (-solveProj.accel / 2) * (solveProj.elevation))) / -solveProj.accel
                ) * 1000) / 1000
            }));
        }
        if(subProj === "velF"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velF:
                Math.round((
                    Math.sqrt(Math.pow(solveProj.velI, 2) + 
                    (2 * -solveProj.accel * -solveProj.elevation))
                ) * 1000) / 1000
            }));
        }
        if(subProj === "angleF"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                angleF:
                Math.round((
                    Math.atan((-Math.sqrt(Math.pow((solveProj.velI * Math.round((Math.sin(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant), 2) + 2 * -solveProj.accel * -solveProj.elevation)) / 
                    (solveProj.velI * Math.round((Math.cos(solveProj.angleI * Math.PI / 180)) * roundingConstant) / roundingConstant)) * (180 / Math.PI)
                ) * 1000) / 1000  
            }));
        }
        if(subProj === "velIOptionOne"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velI: 
                Math.round((
                    (-solveProj.elevation + 0.5 * solveProj.accel * Math.pow(solveProj.time, 2)) / (Math.sin(solveProj.angleI * Math.PI / 180) * solveProj.time)
                ) * 1000) / 1000
                
            }));
        }
        if(subProj === "velIOptionTwo"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velI: 
                Math.round((
                    (-solveProj.velFY + solveProj.accel * solveProj.time) / (Math.sin(solveProj.angleI * Math.PI / 180))
                ) * 1000) / 1000
                
            }));
        }
        if(subProj === "velIOptionThree"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                velI: 
                Math.round((
                    Math.sqrt(Math.pow(solveProj.velFY, 2) - 2 * -solveProj.accel * -solveProj.elevation) / (Math.sin(solveProj.angleI * Math.PI / 180))
                ) * 1000) / 1000
                
            }));
        }
        if(subProj === "angleIOptionOne"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                angleI: 
                Math.round((
                    Math.atan(solveProj.velIY / solveProj.velIX) * (180 / Math.PI)
                ) * 1000) / 1000  
            }));
        }
        if(subProj === "angleIOptionTwo"){
            setSolveProjAnswer((prevSolveProjAnswer) => ({
                ...prevSolveProjAnswer,
                angleI: 
                Math.round((
                    Math.asin(Math.sqrt(Math.pow(solveProj.velFY, 2) - 2 * solveProj.accel * solveProj.elevation) / solveProj.velI) * (180 / Math.PI)
                ) * 1000) / 1000  
            }));
        }
    }



    const [solveProj, setSolveProj] = useState({
        velI: 0,
        angleI: 0,
        angleF: 0,
        elevation: 0,
        accel: 0,
        velIY: 0,
        velIX: 0,
        time: 0,
        velF: 0,
        velFY: 0,
        velFX: 0
    });

    const [solveProjAnswer, setSolveProjAnswer] = useState({
        range: 0,
        max_height: 0,
        time: 0,
        velI: 0,
        velF: 0,
        angleI: 0,
        angleF: 0
    });
    const handleInputChangeSolve = (e) => {
        const {name, value, type} = e.target;

        const finalValue = type === 'number' ? Number(value) : value;

        setSolveProj((prevSolveProj) => ({
            ...prevSolveProj,
            [name]: finalValue,
        }));
    };


.graphDiv button{
  font-family: monospace;
  font-size: 2.5vh;
  border: 1vh solid;
  border-radius: 1vh;
  background-color: rgb(111, 60, 199);
  border-color: rgb(139, 95, 214);
  padding: 1vh;
  color: white;
  position: relative;
  transition: all, 0.1s ease-in-out;
}
.graphDiv button:hover{
  cursor: pointer;
  transform: scale(105%);
  background-color: rgb(123, 78, 201);
  border-color: rgb(162, 129, 218);
}
.containerGraph{
  display: flex;
  justify-content: space-evenly;
}
.graphPopup{
  width: 30vw;
  height: max-content;
  position: absolute;
  top: -55vh;
  left: 5vw;
  font-size: 1.9vh;
  padding: 1vh;
  font-family: monospace;
  border: 1vh solid;
  border-radius: 1vh;
  background-color: rgb(111, 60, 199);
  border-color: rgb(139, 95, 214);
  color: white;
}
.graphContainerForm{
  width: 30vw;
  display: flex;
  flex-direction: column;
  gap: 2vh;
}
.graphAnswers{
  width: 30vw;
  height: 45vh;
  position: absolute;
  left: 33vw;
  top: -0.9vh;
  font-size: 1.9vh;
  padding: 1vh;
  font-family: monospace;
  border: 1vh solid;
  border-radius: 1vh;
  background-color: rgb(111, 60, 199);
  border-color: rgb(139, 95, 214);
  color: white;
}
.a{
  display: none;
}
.b{
  display: flex;
  flex-direction: column;
  gap: 1vh;
  margin: 1vh;
}
.divdiv{
  width: 100vw;
  height: 100vh;
  background-color: red;
}
.graphOptionsBtnContainer{
  display: flex;
  justify-content: center;
}
.graphOptionBtn{
  width: 100%;
  transition: all, 0.1s ease-in-out;
}
.graphOptionBtn:hover{
  cursor: pointer;
  transform: scale(105%);
  background-color: rgb(123, 78, 201);
  border-color: rgb(162, 129, 218);
}

    const [rangeSkills, maxHeightSkills, timeSkills, velISkillsOne, velISkillsTwo, velISkillsThree, velFSkills, angleISkillsOne, angleISkillsTwo, angleFSkills] = [
        "vector decomposition, separation of horizontal and vertical motion, application of kinematic equations, solving quadratic equations, horizontal range formula", 
        "indentifying peak height, application of kinematic equations", 
        "application of kinematic equations, solving quadratic equations", 
        0, 
        0, 
        0, 
        0, 
        0, 
        0, 
        0
    ];
    const [rangeSteps, maxHeightSteps, timeSteps, velIStepsOne, velIStepsTwo, velIStepsThree, velFSteps, angleIStepsOne, angleIStepsTwo, angleFSteps] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    const [rangeProp, maxHeightProp, timeProp, velIPropOne, velIPropTwo, velIPropThree, velFProp, angleIPropOne, angleIPropTwo, angleFProp] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];


        function repeatSolveBtn(inputArray){
        return(
            <div className="containerForm">
                {inputArray.map((_, rowIndex) => (
                    <div className="solveDiv">
                        <button onClick={() => setSubProj(inputArray[rowIndex][0])}>{inputArray[rowIndex][1]}</button>
                    </div>
                ))}
            </div>
        );
    }

    function solveOptionBtn(inputArray, condition){
        return(
            <div className={subProj === condition ? "b" : "a"}>
                {inputArray.map((_, rowIndex) => (
                    <div key={rowIndex} className="solveOptionsBtnContainer">
                        <button className="inputDiv solveOptionBtn" onClick={() => setSubProj(inputArray[rowIndex][0])}>
                            {inputArray[rowIndex][1]}
                        </button>
                    </div>
                ))}
            </div>
        );
    }

*/