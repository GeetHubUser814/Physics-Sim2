import React, {useState} from 'react';

function UnitSlider(){
    const [isAnimating, setIsAnimating] = useState(true);
    const showHideKin = new CustomEvent("kinCanvas");
    const showHideForce = new CustomEvent("forceCanvas");
    const showHideWEP = new CustomEvent("WEPCanvas");
    const showHideLinearM = new CustomEvent("LinearMCanvas");

    const kinematicsCanvas = () => {
        window.dispatchEvent(showHideKin);

        const kineToOthers = new CustomEvent("fromKinBtn");
        window.dispatchEvent(kineToOthers);
    };

    const forceCanvas = () => {
        window.dispatchEvent(showHideForce);

        const forceToOthers = new CustomEvent("fromForceBtn");
        window.dispatchEvent(forceToOthers);
    };

    const WEPCanvas = () => {
        window.dispatchEvent(showHideWEP);

        const WEPToOthers = new CustomEvent("fromWEPBtn");
        window.dispatchEvent(WEPToOthers);
    };

    const LinearMCanvas = () => {
        window.dispatchEvent(showHideLinearM);

        const LinearMToOthers = new CustomEvent("fromLinearMBtn");
        window.dispatchEvent(LinearMToOthers);
    };
    
    return(
        <div className={isAnimating ? 'sliderAnimate' : 'sliderNotAnimate'}>
            <div className="unitSliderDiv">
                <button className="slideOpener" onClick={() => setIsAnimating(!isAnimating)} data-label="Open Me!">😃</button>
                <button className="unitBtn" onClick={kinematicsCanvas}>Kinematics</button>
                <button className="unitBtn" onClick={forceCanvas}>Force and Translational Dynamics</button>
                <button className="unitBtn" onClick={WEPCanvas}>Work, Energy, and Power</button>
                <button className="unitBtn" onClick={LinearMCanvas}>Linear Momentum</button>
                <button className="unitBtn">Practice Questions</button>
            </div>
        </div>
    );
}
export default UnitSlider