// import { XMLParser } from "fast-xml-parser";

//  const corsProxy = "https://cors.eu.org/";

// const xmlParseToJson = (xmlData,setRssFeed) => {
//   const parser = new XMLParser();
//   const jsonData = parser.parse(xmlData);
//   console.info(jsonData.rss)
//   setRssFeed(jsonData.rss)
// };

// const fetchRssFeed = (setRssFeed) => {
//   const url = "https://morss.it/:items=%7C%7C*[class=media-caption]/https://english.almayadeen.net/";
//   fetch(corsProxy+ url).then((res) =>
//     res
//       .text()
//       .then((data) => xmlParseToJson(data,setRssFeed))
//       .catch((err) => console.warn("data error:", err))
//       .finally(() => console.info("data completed"))
//       .catch((err) => console.warn("res error:", err))
//       .finally(() => console.info("response completed"))
//   );
// };

// export default fetchRssFeed;


import { XMLParser } from "fast-xml-parser";
import axios from "axios";

const corsProxy = "https://cors.eu.org/";

const fetchRss = async (url) => {
  const { data } = await axios.get(corsProxy + url);
  return data;
};

const fetchMultipleRss = async (urls) => {
  const requests= urls.map(fetchRss)
  const results= await Promise.all(requests)
  return results
};

const parseRss =async(rss)=>{
  const parser = new XMLParser()
  const feed = await parser.parse(rss)
  return feed
}

const parseMultipleRss = async(rssList)=>{
  const requests = rssList.map(parseRss)
  const results= await Promise.all(requests)
  console.info("parseMultipleRss", results)
  return results
}


const combineRss =(feeds)=>{
  const combineFeed= {
    title: 'Combined News Feed',
    items:[]
  }

  feeds.forEach((feed) => {
    combineFeed.items= combineFeed.items.concat(feed.items)    
  });
  console.info(combineFeed)
   return combineFeed
}

export { fetchMultipleRss, parseMultipleRss, combineRss}