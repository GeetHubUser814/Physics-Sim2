import React, {useState} from 'react';

function UnitSlider(){
    const [isAnimating, setIsAnimating] = useState(true);
    return(
        <div className={isAnimating ? 'sliderAnimate' : 'sliderNotAnimate'}>
            <div className="unitSliderDiv">
                <button className="slideOpener" onClick={() => setIsAnimating(!isAnimating)} data-label="Open Me!">😃</button>
                <button className="unitBtn">Kinematics</button>
                <button className="unitBtn">Force and Translational Dynamics</button>
                <button className="unitBtn">Work, Energy, and Power</button>
                <button className="unitBtn">Linear Momentum</button>
                <button className="unitBtn">Practice Questions</button>
            </div>
        </div>
    );
}
export default UnitSlider