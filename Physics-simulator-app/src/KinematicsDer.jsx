import React, {useEffect, useRef, useState} from 'react';
import Mather from './Mather';
import { Icon } from './KinematicsK2';

function KinematicsDer({eq}){

    const [show, setShow] = useState({
        k1: eq === "k1" ? true : false,
        k2: eq === "k2" ? true : false,
        k3: eq === "k3" ? true : false
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
                        [<span>Using the Definition of Acceleration: </span>, 
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
                        [<span>Using the Velocity vs. Time Graph: </span>, 
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
                        [<span>Using the Average Velocity-Displacement Equation and the First Kinematics Equation</span>,
                            <span>
                                The average velocity-displacement equation, derived in another section, can be written as <Mather math="\Delta x = \frac{v_0 + v_f}{2} t"/>. 
                                <br></br><br></br>
                                Rearranging the first kinematics equation gives us <Mather math="t = \frac{v_f-v_0}{a}"/>
                                <br></br><br></br>
                                Substituting this into the average velocity-displacement equation gives us <Mather math="\Delta x = \frac{(v_0 + v_f)(v_f - v_0)}{2 a}"/>.
                                <br></br><br></br>
                                The numerator simplifies to a difference of squares, which gives us <Mather math="\Delta x = \frac{v_f^2 - v_0^2}{2 a}"/>.
                                <br></br><br></br>
                                This simplifies to <Mather math="v_f^2 = v_0^2 + 2 a \Delta x"/>.
                            </span>
                        
                        ]
                    ],
                )
            )}
            
        </div>
    );
}

export default KinematicsDer
/* 
                <div className="derTxt">
                    <p className="derTxtTitle">
                        first kinematics equation: <Mather math="v_f = v_0 + a t"/>.
                    </p>
                    <p className="derTxtREAL">
                        The definition of uniform acceleration is <Mather math="a = \frac{\Delta v}{\Delta t}"/>.
                        <br></br>
                        Change is (new - old) so this becomes <Mather math="a = \frac{v_f - v_0}{t_f - t_0}"/>.
                        <br></br>
                        Assuming time starts at 0, we get <Mather math="a = \frac{v_f - v_0}{t}"/>, and rearranging this gives <Mather math="v_f = v_0 + a t"/>
                    </p>
                </div>
*/
/* 
                <div className="derTxt">
                    <p className="derTxtTitle">
                        second kinematics equation: <Mather math="\Delta x = v_0 t + \frac{1}{2} a t^2"/>.
                    </p>
                    <p className="derTxtREAL">
                        derivation using the graph of velocity vs time:
                        <br></br>
                        The graph of velocity vs time under constant acceleration is a linear graph, 
                        and the area under this graph is equal to displacement. When we look at                            this graph on the interval from some <Mather math="t_0"/> to some <Mather math="t_f"/>
                        , we see that the area under the graph is a trapezoid, which we can split into a
                        rectangle and a triangle. Thus, we can find the area under the graph (the displacement), by
                        adding the areas of this triangle and this rectangle. The rectangle has a base 
                        of <Mather math="\Delta t"/> and a height of <Mather math="v_0"/>, but we will call
                        the base just <Mather math="t"/>, thus the area of the rectangle is <Mather math="v_0t"/>.
                        The triangle also has a base of <Mather math="t"/> aswell as a height     
                    </p>
                </div>
*/