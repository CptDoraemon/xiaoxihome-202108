import './_app.css'
import React from "react";
import type { AppProps } from 'next/app'
import {ThemeProvider} from "@material-ui/styles";
import {CssBaseline} from "@material-ui/core";
import theme from "../theme";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>XiaoxiHome</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export default MyApp
