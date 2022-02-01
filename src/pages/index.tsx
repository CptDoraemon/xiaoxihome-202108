import React from "react";
import Home from "../components/Home/Home";
import Head from "next/head";

const Index = () => {
  return (
    <>
      <Head>
        <title>XiaoxiHome</title>
        <meta
          name={"description"}
          content={"Xiaoxi Yu (Jake), is a Fullstack JavaScript Developer. This is his homepage."}
        />
      </Head>
      <Home/>
    </>
  )
};

export default Index
