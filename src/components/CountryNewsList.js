import React from "react";
import PropTypes from "prop-types";

import { Box } from "@mui/system";
import {
  Card,
  Button,
  CardActions,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
} from "@mui/material/";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`news-source-tabpanel-${index}`}
      aria-labelledby={`news-source-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const newsCards = (rssFeed) => {
  console.log("newsCards",rssFeed)
    const newTestArray= rssFeed.items.slice(0,10)
    console.log(newTestArray)
    const cardItems = newTestArray.map((feed, index) => {    
      console.log("feed", feed)      
      return (
        <ListItem key={index + 1}>
          <Card sx={{ maxWidth: 275 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              ></Typography>
              <Typography variant="h5" component="div">
                {feed.title}
              </Typography>
            </CardContent>
            <CardActions>
              <Button target="_blank" href={feed.link}>Learn More</Button>
            </CardActions>
          </Card>
        </ListItem>
      );
    });
    return cardItems;

};

const CountryNewsList = (properties, tabValue, setTabValue, rssFeed) => {
  if (properties) {
    let selectedCountryFlag = `https://flagcdn.com/w80/${properties.ISO_A2.toLowerCase()}.png`;
    return (
      <Box role="presentation">
        <List>
          <ListItem key={0}>
            <ListItemButton>
              <ListItemText primary={properties.ADMIN} />
            </ListItemButton>
            <ListItemAvatar>
              <img alt={properties.ADMIN} src={selectedCountryFlag} />
            </ListItemAvatar>
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ maxWidth: { xs: 275 } }}>
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => setTabValue(newValue)}
            aria-label="News tabs"
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Al-Mayadeen" {...a11yProps(0)} />
            {/* <Tab label="Al-jazeera" {...a11yProps(1)} />
            <Tab label="BBC" {...a11yProps(2)} />
            <Tab label="CNN" {...a11yProps(3)} />
            <Tab label="RT" {...a11yProps(4)} /> */}
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <List>
            {newsCards(rssFeed)}
          </List>
        </TabPanel>
      </Box>
    );
  }
};

export default CountryNewsList;
