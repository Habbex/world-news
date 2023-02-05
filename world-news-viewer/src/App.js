// import logo from './logo.svg';
// import './App.css';

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Globe from "react-globe.gl";
import { scaleSequentialSqrt } from "d3-scale";
import { geoCentroid } from "d3-geo";
import { interpolateHue } from "d3-interpolate";
import countriesGeoJson from "./ne_110m_admin_0_countries.geojson";
import Drawer from '@mui/material/Drawer';

import CountryOverlay from "./Components/selectedCountyOverlay";

const World = () => {
  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [rotation, setRotation] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedCountryOverlay, setSelectedCountryOverlay] = useState(false);
  const [selectedCountryOverlayPos, setSelectedCountryOverlayPos] =
    useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // useEffect(() => {
  //   const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };
  //   globeRef.current.pointOfView(MAP_CENTER, 0);
  // }, [globeRef]);

  useEffect(() => {
    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 0.35;

    globeRef.current.pointOfView({ altitude: 1.4 }, 5000);
  }, [rotation]);

  const handleCountryPolygonClick = (countryPolygon) => {
    setSelectedCountry(countryPolygon);
    console.log(countryPolygon)
    setDrawerOpen(true)
    const centerOfCountry = geoCentroid(countryPolygon.geometry);

    const countryLocation = {
      lat: centerOfCountry[1],
      lng: centerOfCountry[0],
      altitude: 1,
    };

    globeRef.current.controls().autoRotate = false;
    globeRef.current.pointOfView(countryLocation, 1);

    setSelectedCountryOverlayPos(
      globeRef.current.getScreenCoords(
        centerOfCountry[1],
        centerOfCountry[0],
        1.5
      )
    );
    setSelectedCountryOverlay(true);
  };

  useEffect(() => {
    // load data
    fetch(countriesGeoJson)
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  const onHoverHandler = useCallback((polygon) => {
    if (polygon !== null) {
      setHoverD(polygon);
      globeRef.current.controls().autoRotate = false;
    } else {
      setHoverD(null);
      globeRef.current.controls().autoRotate = true;
    }
  }, []);

  // const colorScale = scaleSequentialSqrt(interpolateHue(10, 20));

  // // GDP per capita (avoiding countries with small pop)
  // const getVal = (feat) =>
  //   feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  // const maxVal = useMemo(
  //   () => Math.max(...countries.features.map(getVal)),
  //   [countries]
  // );
  // colorScale.domain([0, maxVal]);

  return (
    <div>
      <Globe
        ref={globeRef}
        animateIn={true}
        showGraticules={true}
        // globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries.features.filter(
          (d) => d.properties.ISO_A2 !== "AQ"
        )}
        polygonAltitude={(d) => (d === hoverD ? 0.05 : 0.005)}
        polygonCapColor={(d) =>
          d === hoverD ? "rgba(255, 255,255, 0.3)" : "rgba(255, 255,255, 0)"
        }
        polygonSideColor={() => "rgba(255, 255, 255, 0)"}
        polygonStrokeColor={() => "#111"}
        onPolygonClick={handleCountryPolygonClick}
        onPolygonHover={onHoverHandler}
        polygonsTransitionDuration={300}
        polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b>
      `}
      />
       <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="drawer">
          <h2>{selectedCountry && selectedCountry.properties.ADMIN}</h2>
          {/* <p>Capital: {selectedCountry && selectedCountry.properties.capital}</p> */}
        </div>
      </Drawer>
    </div>
  );
};

export default World;
