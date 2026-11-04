import React, {useEffect, useRef, useState} from 'react';
import Mather from './Mather';
import { Icon } from './KinematicsK2';

function KinematicsDer({eq}){

    const [show, setShow] = useState({
        k1: eq === "k1" ? true : false,
        k2: eq === "k2" ? true : false,
        k3: eq === "k3" ? true : false,
        avgV: eq === "avgV" ? true : false,
        range: eq === "range" ? true : false,
        maxHeight: eq === "maxHeight" ? true : false,
        impactVel: eq === "impactVel" ? true : false,
        impactAngle: eq === "impactAngle" ? true : false
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
    return(
        <div className="der">
            {(show.k1) && (
                writeDerivation(
                    <span>First Kinematics Equation: <Mather math="v_f = v_0 + a t"/></span>,
                    [
                        [<span>Using the Definition of Acceleration</span>, 
                            <span>
                                The definition of uniform acceleration is <Mather math="a = \frac{\Delta v}{\Delta t}"/>.
                                <br></br><br></br>
                                Change is (new - old) so this becomes <Mather math="a = \frac{v_f - v_0}{t_f - t_0}"/>.
                                <br></br><br></br>
                                Assuming time starts at 0, we get <Mather math="a = \frac{v_f - v_0}{t}"/>, and rearranging 
                                this gives <Mather math="v_f = v_0 + a t"/>
                            </span>
                        ]
                    ],
                )
            )}
            {(show.k2) && (
                writeDerivation(
                    <span>Second Kinematics Equation: <br></br><Mather math="\Delta x = v_0 t + \frac{1}{2} a t^2"/></span>,
                    [
                        [<span>Using the Velocity vs. Time Graph</span>, 
                            <span>
                                The graph of velocity vs time under constant acceleration is a linear graph, 
                                and the area under this graph is equal to displacement. 
                                <br></br><br></br>
                                When we look at 
                                this graph on the interval from some <Mather math="t_0"/> to some <Mather math="t_f"/>
                                , we see that the area under the graph is a trapezoid, which we can split into a
                                rectangle and a triangle. Thus, we can find the area under the graph (the displacement), by
                                adding the areas of this triangle and this rectangle. 
                                <br></br>
                                <Icon size={300}/>
                                <br></br>
                                The rectangle has a base 
                                of <Mather math="\Delta t"/> and a height of <Mather math="v_0"/>, but we will call
                                the base just <Mather math="t"/>, thus the area of the rectangle is <Mather math="v_0t"/>.
                                <br></br><br></br>
                                The triangle also has a base of <Mather math="t"/> aswell as a height 
                                of <Mather math="(v_f - v_0)"/> or <Mather math="\Delta v"/>, giving it an area of 
                                <Mather math="\frac{1}{2} \Delta v t"/>. We can subsitute <Mather math="at"/> in 
                                for <Mather math="\Delta v"/> (definition of acceleration), to give us the area 
                                of the triangle as <Mather math="\frac{1}{2} a t^2"/>. 
                                <br></br><br></br>
                                Thus, adding the area of the 
                                rectangle and the area of the triangle to find the displacement gives us the 
                                equation <Mather math="\Delta x = v_0 t + \frac{1}{2} a t^2"/>.
                                <br></br>
                            </span>,
                        ],
                        [<span>Using the Average Velocity-Displacement Equation and the First Kinematics Equation</span>,
                            <span>
                                The average velocity-displacement equation, derived in another section, can be written as <Mather math="\Delta x = \frac{v_0 + v_f}{2} t"/>. 
                                <br></br><br></br>
                                Substituting in the first kinematics equation <Mather math="v_f = v_0 + a t"/> into the average velocity-displacement equation gives us <Mather math="\Delta x = \frac{v_0 + (v_0 + a t)}{2} t"/>.
                                <br></br><br></br>
                                Simplifying this, we get <Mather math="\Delta x = v_0 t + \frac{1}{2} a t^2"/>.
                            </span>
                        
                        ]
                    ],
                )
            )}
            {(show.k3) && (
                writeDerivation(
                    <span>Third Kinematics Equation: <br></br><Mather math="v_f^2 = v_0^2 + 2 a \Delta x"/></span>,
                    [
                        [<span>Using the First and Second Kinematics Equations</span>,
                            <span>
                                The first kinematics equation can be written as <Mather math="t = \frac{v_f - v_0}{a}"/>.
                                <br></br><br></br>
                                Substituting this into the second kinematics equation <br></br>(<Mather math="\Delta x = v_0 t + \frac{1}{2} a t^2"/>) gives 
                                us <Mather math="\Delta x = v_0 \frac{v_f - v_0}{a} + \frac{1}{2} a \left(\frac{v_f - v_0}{a}\right)^2"/>.
                                <br></br><br></br>
                                This simplifies to <Mather math="\Delta x = \frac{2 v_f v_0 - v_0^2 + (v_f - v_0)^2}{2 a}"/>.
                                <br></br><br></br>
                                This further simplifies to <Mather math="\Delta x = \frac{v_f^2 - v_0^2}{2 a}"/>.
                                or <Mather math="v_f^2 = v_0^2 + 2 a \Delta x"/>.
                            </span>
                        
                        ],
                        [<span>Using the Average Velocity-Displacement Equation and the First Kinematics Equation</span>,
                            <span>
                                The average velocity-displacement equation, derived in another section, can be written as <Mather math="\Delta x = \frac{v_0 + v_f}{2} t"/>. 
                                <br></br><br></br>
                                Rearranging the first kinematics equation gives us <Mather math="t = \frac{v_f-v_0}{a}"/>
                                <br></br><br></br>
                                Substituting this into the average velocity-displacement equation gives us <Mather math="\Delta x = \frac{(v_0 + v_f)(v_f - v_0)}{2 a}"/>.
                                <br></br><br></br>
                                The numerator simplifies to a difference of squares, which gives us <Mather math="\Delta x = \frac{v_f^2 - v_0^2}{2 a}"/>, which
                                simplifies to <Mather math="v_f^2 = v_0^2 + 2 a \Delta x"/>.
                            </span>
                        
                        ],
                        [<span>Using the Work Energy Theorem</span>,
                            <span>
                                The work-energy theorem states that the net work done on an object equals the change in its kinetic energy: <Mather math="W_{net} = \Delta K"/>.
                                <br></br><br></br>
                                The definition of net work is <Mather math="W_{net} = F_{net} \Delta x"/>, and using Newton's second law, <Mather math="F_{net} = m a"/>, we get <Mather math="W_{net} = m a \Delta x"/>.
                                <br></br><br></br>
                                Substituting in change in kinetic energy for work gives us <br></br> <Mather math="\frac{1}{2} m v_f^2 - \frac{1}{2} m v_0^2 = m a \Delta x"/>.
                                <br></br><br></br>
                                Dividing both sides by <Mather math="m"/> gives us <Mather math="\frac{1}{2} v_f^2 - \frac{1}{2} v_0^2 = a \Delta x"/>, and 
                                solving for <Mather math="v_f^2"/> gives us <Mather math="v_f^2 = v_0^2 + 2 a \Delta x"/>.
                            </span>
                        ]

                    ],
                )
            )}
            {(show.avgV) && (
                writeDerivation(
                    <span>Average Velocity-Displacement Equation: <br></br><Mather math="\frac{v_0 + v_f}{2} = \frac{x_f - x_0}{t}"/></span>,
                    [
                        [<span>Using the Velocity vs Time Graph</span>,
                            <span>
                                The graph of velocity vs time under constant acceleration is a linear graph, 
                                and the area under this graph is equal to displacement. 
                                <br></br><br></br>
                                When we look at 
                                this graph on the interval from some <Mather math="t_0"/> to some <Mather math="t_f"/>
                                , we see that the area under the graph is a trapezoid, which we can split into a
                                rectangle and a triangle. Thus, we can find the area under the graph (the displacement), by
                                adding the areas of this triangle and this rectangle. 
                                <br></br>
                                <Icon size={300}/>
                                <br></br>
                                The rectangle has a base 
                                of <Mather math="\Delta t"/> and a height of <Mather math="v_0"/>, but we will call
                                the base just <Mather math="t"/>, thus the area of the rectangle is <Mather math="v_0t"/>.
                                <br></br><br></br>
                                The triangle also has a base of <Mather math="t"/> aswell as a height 
                                of <Mather math="(v_f - v_0)"/> or <Mather math="\Delta v"/>, giving it an area of 
                                <Mather math="\frac{1}{2} \Delta v t"/>.
                                <br></br><br></br>
                                Adding the areas of the rectangle and the triangle gives us the total displacement:
                                <Mather math="\Delta x = v_0 t + \frac{1}{2} \Delta v t"/>, or <br></br> <Mather math="\Delta x = (v_0 + \frac{1}{2}v_f - \frac{1}{2}v_0) t"/>, 
                                further simplifying to <Mather math="\Delta x = \frac{v_0 + v_f}{2} t"/> or <Mather math="\frac{v_0 + v_f}{2} = \frac{x_f - x_0}{t}"/>.
                            </span>
                        ],
                        [<span>Using the Definition of Average Velocity, the First Kinematics Equation, and the Second Kinemtics Equation</span>,
                            <span>
                                Average velocity under constant acceleration is <Mather math="v_{avg} = \frac{\Delta x}{\Delta t}"/>
                                <br></br><br></br>
                                Substituting the second kinematics equation (<Mather math="\Delta x = v_0 t + \frac{1}{2} a t^2"/>) into the definition of average velocity 
                                gives us <Mather math="v_{avg} = \frac{v_0 t + \frac{1}{2} a t^2}{t}"/> or <Mather math="v_{avg} = v_0 + \frac{1}{2} a t"/>.
                                <br></br><br></br>
                                Using the first kinematics equation (<Mather math="v_f = v_0 + a t"/>), we can substitute <Mather math="a t = v_f - v_0"/> into the expression for average velocity, giving 
                                us <Mather math="v_{avg} = v_0 + \frac{1}{2} (v_f - v_0)"/> or <Mather math="v_{avg} = \frac{v_0 + v_f}{2}"/>.
                                <br></br><br></br>
                                This proves that average velocity equals <Mather math="\frac{v_0 + v_f}{2}"/>. Thus circling back to the definition of average
                                velocity (<Mather math="v_{avg} = \frac{\Delta x}{\Delta t}"/>), we get <br></br><Mather math="\frac{v_0 + v_f}{2} = \frac{x_f - x_0}{t}"/>.
                            </span>
                        
                        ]
                    ],
                )
            )}
            {(show.range) && (
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
            {(show.maxHeight) && (
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
            {(show.impactVel) && (
                writeDerivation(
                    <span>Projectile's Impact Speed: <Mather math="v_f = \sqrt{v_0^2 + 2 g y_0}"/></span>,
                    [
                        [<span>Using Kinematics</span>,
                            <span>
                                The impact speed of a projectile with initial speed <Mather math="v_0"/> and launch height <Mather math="h"/> and launch angle <Mather math="\theta"/> can
                                be found by finding the final vertical velocity <Mather math="(v_f)_y"/> and final horizontal velocity <Mather math="(v_f)_x"/>. The impact speed is the same thing
                                as the magnitude of final velocity, thus the impact speed equals the square root of the sum of the squares of the final vertical and horizontal velocities:<br></br>
                                <Mather math="v_f = \sqrt{((v_f)_x)^2 + ((v_f)_y)^2}"/>.
                                <br></br><br></br>
                                The final horizontal velocity is the same as the initial horizontal velocity, <Mather math="(v_f)_x = v_0 cos(\theta)"/>.
                                <br></br><br></br>
                                The final vertical velocity can be found using the third kinematics equation for vertical equation, where acceleration equals <Mather math="-g"/> and vertical displacement 
                                equals <Mather math="-y_0"/>: <br></br><Mather math="((v_f)_y)^2 = (v_0 sin(\theta))^2 + 2 (-g) (-y_0)"/>.
                                <br></br><br></br>
                                Solving for <Mather math="(v_f)_y"/> gives <Mather math="(v_f)_y = \sqrt{(v_0 sin(\theta))^2 + 2 g y_0}"/>.
                                <br></br><br></br>
                                Substituting <Mather math="(v_f)_y"/> and <Mather math="(v_f)_x"/> into the impact speed formula gives:
                                <br></br><Mather math="v_f = \sqrt{(v_0 cos(\theta))^2 + ((v_0 sin(\theta))^2 + 2 g y_0)}"/>. This expression can be written as <Mather math="v_f = \sqrt{v_0^2(cos^2(\theta) + sin^2(\theta)) + 2 g y_0}"/>
                                , and using the Pythagorean identity <Mather math="cos^2(\theta) + sin^2(\theta) = 1"/> gives the final equation:
                                <br></br><Mather math="v_f = \sqrt{v_0^2 + 2 g y_0}"/>.
                            </span>
                        ],
                        [<span>Using Conservation of Energy</span>,
                            <span>
                                The impact speed of a projectile with initial speed <Mather math="v_0"/> and launch height <Mather math="y_0"/> can be found using conservation of energy.
                                We will set the ground as the reference point for potential energy, so the initial energy of the projectile-earth system is <br></br><Mather math="E_0 = K_0 + U_0 = \frac{1}{2} m v_0^2 + m g y_0"/>.
                                <br></br><br></br>
                                At the point of impact, the projectile is on the ground and the potential energy equals zero, therefore the final energy of the projectile-earth system is <Mather math="E_f = K_f + U_f = \frac{1}{2} m v_f^2 + 0"/>.
                                <br></br><br></br>
                                By conservation of energy, <Mather math="E_0 = E_f"/>:
                                <br></br><Mather math="\frac{1}{2} m v_0^2 + m g y_0 = \frac{1}{2} m v_f^2"/>.
                                <br></br><br></br>
                                Solving for <Mather math="v_f"/> gives <Mather math="v_f = \sqrt{v_0^2 + 2 g y_0}"/>.
                            </span>
                        ],
                        [<span>Notice</span>,
                            <span>
                                Impact speed does not depend on the projectile's launch angle.
                            </span>
                        ]
                    ],
                )
            )}
            {(show.impactAngle) && (
                writeDerivation(
                    <span>Projectile's Impact Angle: <br></br><Mather math="\theta_f = tan^{-1} (\frac{\sqrt{(v_0 sin(\theta))^2 + 2 g y_0}}{v_0 cos(\theta)})"/></span>,
                    [
                        [<span></span>,
                            <span>
                                The impact angle of a projectile with the horizontal is equal to <Mather math="tan^{-1} \left(\frac{(v_f)_y}{(v_f)_x}\right)"/>.
                                <br></br><br></br>
                                The vertical component of final velocity can be found using the third kinematics equation for vertical motion, with initial 
                                velocity <Mather math="v_0 sin(\theta)"/>, displacement <Mather math="-y_0"/>, and acceleration <Mather math="-g"/>: 
                                <br></br><Mather math="((v_f)_y)^2 = (v_0 sin(\theta))^2 + 2 (-g) (-y_0)"/>. Solving for <Mather math="(v_f)_y"/> gives
                                us <Mather math="(v_f)_y = \sqrt{(v_0 sin(\theta))^2 + 2 g y_0}"/>.
                                <br></br><br></br>
                                The horizontal component of final velocity remains constant throughout the projectile's motion, so <Mather math="(v_f)_x = v_0 cos(\theta)"/>.
                                <br></br><br></br>
                                Substituting these values into the equation for the impact angle gives <Mather math="\theta_f = tan^{-1} (\frac{\sqrt{(v_0 sin(\theta))^2 + 2 g y_0}}{v_0 cos(\theta)})"/>.
                            </span>
                        ]
                    ],
                )
            )}
        </div>
    );
}

export default KinematicsDer
