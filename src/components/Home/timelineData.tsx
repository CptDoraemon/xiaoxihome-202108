import thisImage from "../../assets/this.jpg";

import b2b1 from "../../assets/b2b-1.webp";
import b2b2 from "../../assets/b2b-2.webp";
import b2b3 from "../../assets/b2b-3.webp";
import b2b4 from "../../assets/b2b-4.webp";
import b2b5 from "../../assets/b2b-5.webp";
import b2b6 from "../../assets/b2b-6.webp";
import b2b7 from "../../assets/b2b-7.webp";
import b2b8 from "../../assets/b2b-8.webp";

import cmHome from "../../assets/cryptomibs-home.jpg";
import cmLanding from "../../assets/cryptomibs-landing-2206.jpg";
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
import {JSX} from "react";
import {StaticImageData} from "next/image";

export interface TimelineDataItem {
  year: number,
  title: string,
  description: JSX.Element,
  images: StaticImageData[],
  githubLink?: string,
  demoLink?: string
}

const timelineData: TimelineDataItem[] = [
  {
    year: 2023,
    title: 'B2B ERP project for food catering | Software Developer @ Surge ERP Consulting',
    description:
      <ul>
        <li>Led the development of a B2B ERP platform enabling a food-catering client to manage resources and production planning more efficiently.</li>
        <li>Designed workflows where users create ingredients and recipes, assemble them into menus, define production sites, and assign menu portions per site. The system automatically calculates daily ingredient requirements for the central kitchen and distribution amounts for each on-site food truck.</li>
        <li>Developed reusable widgets on top of Material UI, allowing users to easily create or edit entities and modify fields such as text, datetime, booleans, and 1-N / N-N relationships.</li>
        <li>Implemented algorithms to split wide or long tables into multiple printable, letter-sized PDF pages.</li>
        <li>Built a role-based permission system that supports granular access levels for different user types.</li>
      </ul>,
    images: [b2b1, b2b2, b2b3, b2b4, b2b5, b2b6, b2b7, b2b8] as StaticImageData[]
  },
  {
    year: 2022,
    title: 'Software Developer @ Surge ERP Consulting | CryptoMibs.io',
    description:
      <ul>
        <li>Led development of the blockchain application website, improving accessibility and reducing bundle size, resulting in an 80% faster loading time.</li>
        <li>Developed an Ethereum NFT marketplace with advanced combinable filters and two-way URL syncing for improved SEO and shareability.</li>
        <li>Developed a multiplayer, chess-like WebSocket game featuring room creation/joining, in-app or NFT currency gameplay, real-time chat, and Redis distributed locks to prevent race conditions.</li>
        <li>Created a Node.js AWS Lambda service to dynamically composite, generate, and optimize PNG and SVG images based on user input.</li>
        <li>Managed cloud infrastructure across AWS services including EC2, ECS, ECR, VPC, CloudFront, API Gateway, Lambda, and S3.</li>
      </ul>,
    images: [cmHome, cmLanding, cmStore, cmTrade, cmMibBusterLobby, cmMibBusterInGame] as StaticImageData[],
    demoLink: 'https://www.cryptomibs.io/'
  },
  {
    year: 2022,
    title: 'Renovated XiaoxiHome',
    description:
      <ul>
        <li>Rebuilt my portfolio website using Next.js.</li>
        <li>Created 3D models and baked lighting textures using Blender.</li>
        <li>Built a 3D landing page with Babylon.js and wrote custom fragment and vertex shaders for efficient water rendering.</li>
      </ul>,
    images: [thisImage] as StaticImageData[],
    githubLink: 'https://github.com/CptDoraemon/xiaoxihome-202108'
  },
  {
    year: 2021,
    title: 'News App',
    description:
      <ul>
        <li>Developed a React.js frontend to display categorized and searchable news articles.</li>
        <li>Created a Node.js service to collect and clean news data on a recurring schedule, running reliably for years.</li>
        <li>Implemented a data synchronization service using RabbitMQ to keep MongoDB and Elasticsearch in sync.</li>
        <li>Migrated analytics and full-text search features from MongoDB to Elasticsearch for improved performance.</li>
        <li>Visualized datasets using interactive charts and maps built with d3.js.</li>
        <li>Set up a CI/CD pipeline using Docker Compose and GitHub Actions.</li>
      </ul>,
    images: [newsHome, newsMap, newsSearch, newsWordCloud] as StaticImageData[],
    demoLink: 'https://cptdoraemon.github.io/news-app',
    githubLink: 'https://github.com/CptDoraemon/news-app'
  },
  {
    year: 2020,
    title: 'Blog',
    description:
      <ul>
        <li>Built a blog platform using Python, Django, Django REST Framework, and PostgreSQL.</li>
        <li>Implemented an authentication module using JSON Web Tokens (JWT).</li>
      </ul>,
    images: [blogHome, blogEditor] as StaticImageData[],
    demoLink: 'https://cptdoraemon.github.io/discussion-board-client/',
    githubLink: 'https://github.com/CptDoraemon/discussion-board-client'
  },
  {
    year: 2019,
    title: 'The first XiaoxiHome',
    description:
      <ul>
        <li>Built a landing page featuring a split-flap (mechanical departure board–style) animation using Canvas and CSS, including an algorithm that slices images into tiles based on screen size.</li>
        <li>Created a snowfall animation on Canvas with computations offloaded to a Web Worker for better performance.</li>
      </ul>,
    images: [xiaoxihomeHome, xiaoxihomeFlip, xiaoxihomeSnow] as StaticImageData[],
    demoLink: 'https://xiaoxihome.herokuapp.com/'
  }
];

export default timelineData
