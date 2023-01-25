// import logo from './logo.svg';
// import './App.css';

import React, { useState, useEffect, useMemo, useRef } from "react";
import Globe from "react-globe.gl";
import { scaleSequentialSqrt } from "d3-scale";
import {geoCentroid} from "d3-geo"
import { interpolateHue } from "d3-interpolate";
import countriesGeoJson from "./ne_110m_admin_0_countries.geojson";

const World = () => {
  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [selectedCountry, setSelectedCountry] = useState();


  useEffect(() => {
    const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };
    globeRef.current.pointOfView(MAP_CENTER, 0);
  }, [globeRef]);


  useEffect(() => {
    if (selectedCountry) {
      const centerOfCountry= geoCentroid(selectedCountry.geometry)
      const countryLocation = {
        lat: centerOfCountry[1],
        lng: centerOfCountry[0],
        altitude: 1.2

      };
      globeRef.current.pointOfView(countryLocation,0);
 
    }
  }, [selectedCountry]);

  useEffect(() => {
    // load data
    fetch(countriesGeoJson)
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  const colorScale = scaleSequentialSqrt(interpolateHue(10, 20));

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat) =>
    feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  const maxVal = useMemo(
    () => Math.max(...countries.features.map(getVal)),
    [countries]
  );
  colorScale.domain([0, maxVal]);

  return (
    <div>
      <Globe
        ref={globeRef}
        animateIn={true}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries.features.filter(
          (d) => d.properties.ISO_A2 !== "AQ"
        )}
        polygonAltitude={(d) => (d === hoverD ? 0.1 : 0.01)}
        polygonCapColor={(d) =>
          d === hoverD ? "steelblue" : colorScale(getVal(d))
        }
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        onPolygonClick={setSelectedCountry}
        onPolygonHover={setHoverD}
        polygonsTransitionDuration={300}
      />
      ;
    </div>
  );
};

export default World;
