import Header from './Header.jsx'
import MatterJsTest from './MatterJsTest.jsx'
import UnitSlider from './UnitSlider.jsx';
import KinematicsMatter from './KinematicsMatter.jsx';
import ForceMatter from './ForceMatter.jsx';
import WEPMatter from './WEPMatter.jsx';
import LinearMMatter from './LinearMMatter.jsx';
import DashBoard from './DashBoard.jsx';
import "mafs/core.css";
import 'computer-modern/index.css';
import React from 'react';

function App() {
  return(
    <>
      <Header/>
      <KinematicsMatter/>
      <ForceMatter/>
      <WEPMatter/>
      <LinearMMatter/>
      <DashBoard/>
      <UnitSlider/>
    </>
  );
}

export default App
 