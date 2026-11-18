import React, {useEffect, useRef, useState} from 'react';
import Mather from './Mather';
import { Icon } from './KinematicsK2';

function ForceDer({eq}){

    const [show, setShow] = useState({
        fma: eq === "fma" ? true : false,
        cm: eq === "cm" ? true : false,
        spring: eq === "spring" ? true : false,
        fg: eq === "fg" ? true : false,
        fBigG: eq === "fBigG" ? true : false,
        cent: eq === "cent" ? true : false
    });

    function writeDerivation(title, subAndTxt){

        return(
            <div className="derTxt">
                <p className="derTxtTitle">{title}</p>
                {subAndTxt.map((_, rowIndex) => (
                    <div className="derTxtChunk" key={rowIndex}>
                        <p className="derTxtSubHeading">{subAndTxt[rowIndex][0]}</p>
                        <p className="derTxtREAL">{subAndTxt[rowIndex][1]}</p>
                    </div>                    
                ))}
            </div>
        );
    }
    function eqSelector(inputArray){
        return(
            <div className="kinematicsEqList">
                {inputArray.map((_, rowIndex) => (
                    <div className="kinematicsEqSelector" key={rowIndex}>
                        <button className="dashBtn" onClick={() => setShow(prevState => ({...false, [inputArray[rowIndex][1]]: true}))}>{inputArray[rowIndex][0]}</button>
                    </div>
                ))}
            </div>
        );
    }
    return(
        <div className="der">
            {(show.fma) && (
                writeDerivation(
                    <span>Newton's Second Law: <Mather math="\sum F = ma"/></span>,
                    [
                        [<span>Using the Definition of Acceleration</span>, 
                            <span>

                            </span>
                        ]
                    ],
                )
            )}
            {(show.cm) && (
                writeDerivation(
                    <span>Second Kinematics Equation: <br></br><Mather math="\Delta x = v_0 t + \frac{1}{2} a t^2"/></span>,
                    [
                        [<span>Using the Velocity vs. Time Graph</span>, 
                            <span>

                            </span>,
                        ]
                    ],
                )
            )}
            {(show.spring) && (
                writeDerivation(
                    <span>Third Kinematics Equation: <br></br><Mather math="v_f^2 = v_0^2 + 2 a \Delta x"/></span>,
                    [
                        [<span>Using the First and Second Kinematics Equations</span>,
                            <span>

                            </span>
                        
                        ]

                    ],
                )
            )}
            {(show.fg) && (
                writeDerivation(
                    <span>Average Velocity-Displacement Equation: <br></br><Mather math="\frac{v_0 + v_f}{2} = \frac{x_f - x_0}{t}"/></span>,
                    [
                        [<span>Using the Velocity vs Time Graph</span>,
                            <span>

                            </span>
                        ]
                    ],
                )
            )}
            {(show.fBigG) && (
                writeDerivation(
                    <span>Range Equation (no elevation): <Mather math="R = \frac{v_0^2 \sin(2\theta)}{g}"/></span>,
                    [
                        [<span></span>,
                            <span>
                                The range of a projectile is the horizontal distance it travels before hitting the ground.
                                <br></br><br></br>
                                A projectile in free fall does not have any horizontal acceleration, so the horizontal 
                                distance, or range <Mather math="R"/>, traveled by a projectile with an initial speed <Mather math="v_0"/> and launch angle <Mather math="\theta"/> can be written
                                as <br></br><Mather math="R = v_0 cos(\theta) t"/>.
                                <br></br><br></br>
                                The time of flight <Mather math="t"/> can be found by either using the first or second kinematics equation, giving us <Mather math="t = \frac{2 v_0 \sin(\theta)}{g}"/>.
                                <br></br><br></br>
                                Substituting this into the equation for range, we get <Mather math="R = \frac{2 v_0^2 sin(\theta) cos(\theta)}{g}"/>.
                                <br></br><br></br>
                                Using the double-angle identity for sine, <Mather math="2 \sin(\theta) \cos(\theta) = \sin(2\theta)"/>, we can simplify the range equation to <Mather math="R = \frac{v_0^2 \sin(2\theta)}{g}"/>.
                            </span>
                        ],
                        [<span>Notice</span>,
                            <span>
                                Since <Mather math="sin(x)"/> has a maximum value of <Mather math="1"/>, the range is maximized when <Mather math="\sin(2\theta) = 1"/>, which occurs when the launch 
                                angle <Mather math="\theta"/> equals <Mather math="45^\circ"/> or <Mather math="\frac{\pi}{4}"/>.
                            </span>
                        ]
                    ],
                )
            )}
            {(show.cent) && (
                writeDerivation(
                    <span>Maximum Height Equation:  <Mather math="y_f = y_0 + \frac{( v_0 sin(\theta) )^2}{2g}"/></span>,
                    [
                        [<span>Using the First and Second Kinematic Equations</span>,
                            <span>
                                The maximum height of a projectile with initial speed <Mather math="v_0"/> and launch angle <Mather math="\theta"/> is reached when its vertical velocity becomes zero.
                                <br></br><br></br>
                                Using the first kinematic equation for vertical motion, <Mather math="v_f = v_0 \sin(\theta) - g t"/>, we set <Mather math="v_f = 0"/> to find the time to reach 
                                maximum height: <Mather math="t = \frac{v_0 \sin(\theta)}{g}"/>.
                                <br></br><br></br>
                                Next, we use the second kinematics equation to find the projectile's vertical displacement from the initial height at the time when the projectile reaches its maximum height:
                                <br></br><Mather math="\Delta y = v_0 \sin(\theta) \left(\frac{v_0 \sin(\theta)}{g}\right) - \frac{1}{2} g \left(\frac{v_0 \sin(\theta)}{g}\right)^2"/>.
                                <br></br><br></br>
                                Simplifying this, we get <Mather math="\Delta y = \frac{(v_0 \sin(\theta))^2}{2g}"/>. 
                                <br></br><br></br>
                                Therefore, the maximum height <Mather math="y_f"/> is given by <Mather math="y_f = y_0 + \frac{(v_0 \sin(\theta))^2}{2g}"/>.
                            </span>
                        ],
                        [<span>Using the Third Kinematics Equation (similar to conservation of energy)</span>,
                            <span>
                                The maximum height of a projectile with initial speed <Mather math="v_0"/> and launch angle <Mather math="\theta"/> is reached when its vertical velocity becomes zero.
                                <br></br><br></br>
                                Using the third kinematic equation for vertical motion, where initial velocity is <Mather math="v_0 sin(\theta)"/>, acceleration is <Mather math="-g"/> , 
                                and <Mather math="v_f = 0"/> at maximum height, we get <Mather math="0 = (v_0 sin(\theta))^2 - 2 g \Delta y"/>.
                                <br></br><br></br>
                                Solving for <Mather math="y_f"/>, or maximum height, we get <Mather math="y_f = y_0 + \frac{(v_0 sin(\theta))^2}{2g}"/>.
                            </span>
                        ],
                        [<span>Using Conservation of Energy (similar to the third kinematics equation)</span>,
                            <span>
                                In order to find the maximum height of a projectile with initial speed <Mather math="v_0"/> and launch angle <Mather math="\theta"/>, we 
                                set our point where gravitational potential energy equals zero at the initial height of the projectile <Mather math="y_0"/>. 
                                <br></br><br></br>
                                Since the object is
                                in free fall, the only force acting on the projectile and affecting the maximum height is the vertical gravitational force, thus we will isolate the 
                                vertical motion and ignore the horizontal componenet of velocity <Mather math="v_x = v_0 cos(\theta)"/>.
                                <br></br><br></br>
                                At the initial height, where the projectile
                                has an initial vertical velocity of <Mather math="v_0 sin(\theta)"/>, all the energy of the projectile-earth system is in the form of kinetic energy.
                                <br></br><br></br>
                                At the maximum height, the total energy of the system is entirely in the form of gravitational potential energy, with the kinetic energy being zero.
                                <br></br><br></br>
                                By conservation of energy, we set the initial kinetic energy equal to the final potential energy:
                                <Mather math="\frac{1}{2} m (v_0 sin(\theta))^2 = m g (y_f - y_0)"/>.
                                <br></br><br></br>
                                Solving for <Mather math="y_f"/>, we get <Mather math="y_f = y_0 + \frac{(v_0 sin(\theta))^2}{2g}"/>.
                            </span>
                        ]
                    ],
                )
            )}

            {eqSelector([
                ["newton's second law", "fma"],
                ["center of mass", "cm"],
                ["spring force", "spring"],
                ["uniform force of gravity", "fg"],
                ["force of gravity", "fBigG"],
                ["centripetal force", "cent"],
            ])}
        </div>
    );
}

export default ForceDer
