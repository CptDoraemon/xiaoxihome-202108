import thisImage from "../../assets/this.jpg";

import cmHome from "../../assets/cryptomibs-home.jpg";
import cmMibBusterLobby from "../../assets/cryptomibs-mibbuster-lobby.jpg";
import cmMibBusterInGame from "../../assets/cryptomibs-mibbuster-ingame.jpg";
import cmStore from "../../assets/cryptomibs-store.jpg";
import cmTrade from "../../assets/cryptomibs-trade-store.jpg";

import newsHome from "../../assets/news-home.jpg";
import newsSearch from "../../assets/news-search.jpg";
import newsMap from "../../assets/news-map.jpg";
import newsWordCloud from "../../assets/news-word-cloud.jpg";

import blogHome from "../../assets/blog-home.jpg";
import blogEditor from "../../assets/blog-editor.jpg";

import xiaoxihomeHome from "../../assets/xiaoxihome-home.jpg"
import xiaoxihomeFlip from "../../assets/xiaoxihome-flip.jpg"
import xiaoxihomeSnow from "../../assets/xiaoxihome-snow.jpg"

export interface TimelineDataItem {
  year: number,
  title: string,
  description: string | JSX.Element,
  images: Array<StaticImageData>,
  githubLink?: string,
  demoLink?: string
}

const timelineData: TimelineDataItem[] = [
  {
    year: 2022,
    title: 'Software Developer @ Surge ERP Consulting',
    description:
      <ul>
        <li>Lead the development of React app, improved overall accessibility, reduced loading time by 80%</li>
        <li>Develop marketplaces for Ethereum NFTs, allowing users to interact with smart contracts</li>
        <li>Develop a multiplayer game from end to end using WebSocket and Socket.io</li>
        <li>Develop a Node.js service with AWS Lambda to dynamically composite and generate PNG/SVG images with user’s inputs</li>
        <li>Develop Node.js apps to automate routine workflows</li>
        <li>Manage AWS ECS stacks</li>
      </ul>,
    images: [cmHome, cmStore, cmTrade, cmMibBusterLobby, cmMibBusterInGame],
    demoLink: 'https://www.cryptomibs.io/'
  },
  {
    year: 2022,
    title: 'Renovated XiaoxiHome',
    description:
    <ul>
      <li>Built portfolio website built with Next.js</li>
      <li>Built a 3D scene into webpage with Babylon.js</li>
      <li>Created 3D models and baked light textures with Blender</li>
    </ul>,
    images: [thisImage],
    githubLink: 'https://github.com/CptDoraemon/xiaoxihome-202108'
  },
  {
    year: 2021,
    title: 'News App',
    description:
    <ul>
      <li>Developed a frontend app with React.js to display news articles</li>
      <li>Developed a Node.js app to collect and clean news data recurrently, has been working reliably for years</li>
      <li>Developed a service with RabbitMQ to synchronize data between MongoDB and Elasticsearch</li>
      <li>Migrated analytics and search functionalities from MongoDB to Elaticsearch</li>
      <li>Visualized data into various interactive charts and map with d3.js</li>
      <li>Built CI/CD pipeline with Docker-Compose and GitHub Actions</li>
    </ul>,
    images: [newsHome, newsMap, newsSearch, newsWordCloud],
    demoLink: 'https://cptdoraemon.github.io/news-app',
    githubLink: 'https://github.com/CptDoraemon/news-app'
  },
  {
    year: 2020,
    title: 'Blog',
    description:
      <ul>
        <li>Built a blog with Python, Django, Django Rest Framework, and PostgreSQL</li>
        <li>Built Authentication module with JSON Web Token (JWT)</li>
      </ul>,
    images: [blogHome, blogEditor],
    demoLink: 'https://cptdoraemon.github.io/discussion-board-client/',
    githubLink: 'https://github.com/CptDoraemon/discussion-board-client'
  },
  {
    year: 2019,
    title: 'The first XiaoxiHome',
    description:
    <ul>
      <li>Discontinued, please give time for demo server to wake</li>
      <li>Built a split-flap effect cover page with canvas and CSS, custom algorithm to divide images into proper-sized tiles</li>
      <li>Built snowfall animation on canvas, with computation offloaded to Web Worker to improve performance</li>
    </ul>,
    images: [xiaoxihomeHome, xiaoxihomeFlip, xiaoxihomeSnow],
    demoLink: 'https://xiaoxihome.herokuapp.com/'
  }
];

export default timelineData
