import React from "react";
import {makeStyles} from "@material-ui/core";
import Cover from "./Cover";
import Timeline from "./Timeline";
import Footer from "./Footer";
import SectionTitle from "./SectionTitle";
import HireForm from "./HireForm/HireForm";

interface HomeProps {}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  widthWrapper: {
    width: '100%',
    maxWidth: theme.breakpoints.values['xl'],
    padding: theme.spacing(0, 2),
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.widthWrapper}>
        <Cover/>

        <SectionTitle title={'My experience in'} subTitle={'Web development'} />
        <Timeline/>

        <SectionTitle title={'Wanna hire me?'} subTitle={`let's get in touch`} />
        <HireForm/>

        <Footer/>
      </div>
    </div>
  )
};

export default Home
