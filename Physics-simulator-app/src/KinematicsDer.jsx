import React, {useEffect, useRef, useState} from 'react';
import Mather from './Mather';

function KinematicsDer({eq}){

    const [show, setShow] = useState({
        k1: eq === "k1" ? true : false,
        k2: eq === "k2" ? true : false,
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
                                <br></br><br></br>
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
                            </span>,
                        ],
                        [<span>Using the Average Velocity-Displacement Equation</span>,
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum suscipit porro eligendi ad dicta iusto a necessitatibus atque fugit dolore, aliquam unde, voluptates delectus totam accusantium quae minus error quam?
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