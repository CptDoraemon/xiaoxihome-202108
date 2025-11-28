import React, {JSX} from "react";
import {makeStyles} from "@material-ui/core";
import {ARROW_HEIGHT} from "./SectionTitle";

const useStyles = makeStyles((theme) => ({
  // fullscreen size on big screen
  // square (almost) on mobile
  root: {
    width: '100%',
    height: `calc(100vh - ${0.5 * ARROW_HEIGHT}px)`,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
      paddingBottom: '130%'
    }
  },
  payload: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2, 0),
    }
  }
}));

interface CoverSizeProps {
  children: JSX.Element | JSX.Element[]
}

const CoverSize = ({children}: CoverSizeProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.payload}>
        {children}
      </div>
    </div>
  )
};

export default CoverSize
