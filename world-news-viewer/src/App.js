// import logo from './logo.svg';
// import './App.css';

import React, {useState, useEffect, useMemo, useRef} from 'react'
import Globe from 'react-globe.gl'
import {scaleSequentialSqrt} from 'd3-scale'
import {interpolateHue} from 'd3-interpolate'
import countriesGeoJson from './ne_110m_admin_0_countries.geojson'

const World=()=>{
  const globaEl= useRef();
  const [countries, setCountries]= useState({features:[]})
  const [hoverD, setHoverD]= useState();

  useEffect(()=>{
    const globe= globaEl.current
      // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.35;
  })


  useEffect(() => {
    // load data
    fetch(countriesGeoJson).then(res=> res.json()).then(setCountries)
  }, []) 

  const colorScale= scaleSequentialSqrt(interpolateHue(10,20));

   // GDP per capita (avoiding countries with small pop)
   const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

   const maxVal = useMemo(
     () => Math.max(...countries.features.map(getVal)),
     [countries]
   );
   colorScale.domain([0, maxVal]);

   return <Globe
    ref={globaEl}
    animateIn={true}
     globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
     backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
     lineHoverPrecision={0}
     polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
     polygonAltitude={d => d === hoverD ? 0.1 : 0.01}
     polygonCapColor={d => d === hoverD ? 'steelblue' : colorScale(getVal(d))}
     polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
     polygonStrokeColor={() => '#111'}
     polygonLabel={({ properties: d }) => `
       <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
       GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
       Population: <i>${d.POP_EST}</i>
     `}
     onPolygonHover={setHoverD}
     polygonsTransitionDuration={300}
   />;
 };

 export default World;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
