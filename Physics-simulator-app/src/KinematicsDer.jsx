import React, {useEffect, useRef, useState} from 'react';
import Mather from './Mather';

function KinematicsDer(eq){


    return(
        <div className="der">
            {(eq === "k1") && (
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
            )}
            {(eq == "k2") && (
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
            )}
        </div>
    );
}

export default KinematicsDer