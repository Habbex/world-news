// import logo from './logo.svg';
// import './App.css';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Globe from "react-globe.gl";

import Drawer from "@mui/material/Drawer";
import { geoCentroid } from "d3-geo";
import { interpolateHue } from "d3-interpolate";
import { scaleSequentialSqrt } from "d3-scale";
import countriesGeoJson from "./ne_110m_admin_0_countries.geojson";

import * as THREE from "three";

import { Grid, List } from "@mui/material";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import CountryOverlay from "./Components/selectedCountyOverlay";

const World = () => {
  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverCountryPolygon, setHoverCountryPolygon] = useState();
  const [rotation, setRotation] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const globeMaterial = new THREE.MeshPhongMaterial();
  globeMaterial.shininess = 2;
  globeMaterial.refractionRatio = 0.2;
  globeMaterial.color = new THREE.Color("#001f05");

  useEffect(() => {
    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 0.32;

    globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 1.8 }, 0);

    // Maybe fix
    // globeRef.current.controls().addEventListener("start", () => {
    //   globeRef.current.controls().autoRotate = false;
    // });
  }, [rotation]);

  const handleCountryPolygonClick = (countryPolygon) => {
    setSelectedCountry(countryPolygon);

    setDrawerOpen(true);
    setCountryLabel(true);

    const centerOfCountry = geoCentroid(countryPolygon.geometry);

    const countryLocation = {
      lat: centerOfCountry[1],
      lng: centerOfCountry[0],
      altitude: 1,
    };

    globeRef.current.controls().autoRotate = false;
    globeRef.current.pointOfView(countryLocation, 3000);
  };

  useEffect(() => {
    // load data
    fetch(countriesGeoJson)
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  const onHoverHandler = useCallback((polygon) => {
    if (selectedCountry) {
      setHoverD(selectedCountry);
      globeRef.current.controls().autoRotate = false;
    } else if (polygon !== selectedCountry) {
      setHoverD(polygon);
      globeRef.current.controls().autoRotate = false;
    } else {
      setHoverD(null);
      globeRef.current.controls().autoRotate = true;
    }
  }, [selectedCountry]);

  const handleCountryLabel =useCallback((countryPolygon) => {
    if(drawerOpen===false){ 
      return `<b>${countryPolygon.properties.ADMIN} (${countryPolygon.properties.ISO_A2})</b>`;   
    }
  },[drawerOpen]);

  const drawerWidth = 240;

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      // flexShrink: 0,
    },
  }));

  const StyledGrid = styled(Grid)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
  }));
  const countryNewsList = (properties) => {
    if (properties) {
      return (
        <Box role="presentation">
          <List>
            <ListItem key={0}>
              <ListItemButton>
                <ListItemText primary={properties.ADMIN} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key={1}>
              <ListItemButton>
                <ListItemText primary={properties.ADMIN} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      );
    }
  };

  return (
    <Grid container>
      <Globe
        ref={globeRef}
        animateIn={true}
        showGraticules={true}
        //globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries.features.filter(
          (d) => d.properties.ISO_A2 !== "AQ"
        )}
        polygonAltitude={(d) => (d === hoverD ? 0.05 : 0.005)}
        polygonCapColor={(d) =>
          d === selectedCountry
            ? "rgba(255, 255,255, 0.3)"
            : "rgba(255, 255,255, 0)"
        }
        polygonSideColor={() => "rgba(255, 255, 255, 0)"}
        polygonStrokeColor={() => "#111"}
        onPolygonClick={handleCountryPolygonClick}
        onPolygonHover={onHoverHandler}
        polygonsTransitionDuration={300}
        polygonLabel={handleCountryLabel}
      />
      <StyledDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setRotation(false);
          setCountryLabel(false);
          setSelectedCountry(null);
          globeRef.current.pointOfView({ altitude: 1.4 }, 3000);
          setHoverD(null)
        }}
      >
        {selectedCountry && countryNewsList(selectedCountry.properties)}
      </StyledDrawer>
    </Grid>
  );
};

export default World;
