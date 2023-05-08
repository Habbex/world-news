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
    combineFeed.items= combineFeed.items.concat(feed.rss.channel.item)    
  });
  console.info(combineFeed)
   return combineFeed
}

export { fetchMultipleRss, parseMultipleRss, combineRss}