import React, { useCallback, useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { geoCentroid } from "d3-geo";

import { Grid, Drawer, styled } from "@mui/material";
import countriesGeoJson from "./ne_110m_admin_0_countries.geojson";
import CountryNewsList from "./components/CountryNewsList";
import {  combineRss, fetchMultipleRss, parseMultipleRss } from "./lib";

const World = () => {
  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [hoverCountryPolygon, setHoverCountryPolygon] = useState();
  const [rotation, setRotation] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [rssFeed, setRssFeed] = useState();

  const drawerWidth = 240;
  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      zIndex: 4,
      position: "absolute",
      // flexShrink: 0,
    },
  }));

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

  useEffect(() => {
    // load data
    fetch(countriesGeoJson)
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  // useEffect(() => {
  //   fetchRssFeed(setRssFeed)
  // }, [])

  useEffect(() => {
    const fetchAndCombine = async () => {
      const rssList = await fetchMultipleRss([
        "https://morss.it/:items=%7C%7C*[class=media-caption]/https://english.almayadeen.net/",
        "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        "http://feeds.bbci.co.uk/news/rss.xml",
        "https://globalnews.ca/world/feed/",
        "https://moxie.foxnews.com/google-publisher/world.xml",
        "http://www.aljazeera.com/xml/rss/all.xml",
        "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms",
        "https://www.rt.com/rss/news/",
        "https://www.reutersagency.com/feed/?best-topics=political-general&post_type=best",
        "https://www.france24.com/en/rss",
        "http://www.channelnewsasia.com/rssfeeds/8395884",
        "http://feeds.news24.com/articles/news24/World/rss",
        "https://www.scmp.com/rss/91/feed",
        "https://www.france24.com/en/rss",
        // "https://rss.dw.com/rdf/rss-en-all"
      ]);
      const parsedFeeds= await parseMultipleRss(rssList);
      setRssFeed(combineRss(parsedFeeds))
      
    };
    fetchAndCombine();
  }, []);

  const handleCountryPolygonClick = (countryPolygon) => {
    setSelectedCountry(countryPolygon);

    setDrawerOpen(true);
    const centerOfCountry = geoCentroid(countryPolygon.geometry);
    const countryLocation = {
      lat: centerOfCountry[1],
      lng: centerOfCountry[0],
      altitude: 1,
    };

    globeRef.current.controls().autoRotate = false;
    globeRef.current.pointOfView(countryLocation, 3000);
  };

  const onHoverHandler = useCallback(
    (countryPolygon) => {
      if (selectedCountry) {
        setHoverCountryPolygon(selectedCountry);
        globeRef.current.controls().autoRotate = false;
      } else if (countryPolygon !== selectedCountry) {
        setHoverCountryPolygon(countryPolygon);
        globeRef.current.controls().autoRotate = false;
      } else {
        setHoverCountryPolygon(countryPolygon);
        globeRef.current.controls().autoRotate = true;
      }
    },
    [selectedCountry, globeRef]
  );

  return (
    <Grid container>
      <Globe
        ref={globeRef}
        globeMaterial={globeMaterial}
        animateIn={true}
        showGraticules={true}
        showAtmosphere={false}
        backgroundColor="#030303"
        lineHoverPrecision={0}
        polygonsData={countries.features.filter(
          (d) => d.properties.ISO_A2 !== "AQ"
        )}
        polygonAltitude={(d) => (d === hoverCountryPolygon ? 0.05 : 0.008)}
        polygonCapColor={(d) =>
          d === hoverCountryPolygon ? "rgb(0,149,25)" : "rgb(0,90,15)"
        }
        polygonSideColor={() => "rgb(0,70,12, 0.15)"}
        polygonStrokeColor={() => "#111"}
        onPolygonClick={handleCountryPolygonClick}
        onPolygonHover={onHoverHandler}
        polygonsTransitionDuration={300}
        polygonLabel={({ properties: d }) =>
          !drawerOpen &&
          `
          <b>${d.ADMIN} (${d.ISO_A2})</b>
        `
        }
      />
      <StyledDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setRotation(false);
          setSelectedCountry(null);
          globeRef.current.pointOfView({ altitude: 1.8 }, 3000);
          setHoverCountryPolygon(null);
        }}
      >
        {selectedCountry &&
          CountryNewsList(
            selectedCountry.properties,
            tabValue,
            setTabValue,
            rssFeed
          )}
      </StyledDrawer>
    </Grid>
  );
};

export default World;
