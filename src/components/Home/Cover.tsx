import React from "react";
import {makeStyles, Paper} from "@material-ui/core";
import CoverCanvas from "./CoverCanvas/CoverCanvas";
import CoverSize from "./CoverSize";

interface CoverProps {}

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    canvas: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10
    },
  }
});

const Cover = () => {
  const classes = useStyles();

  return (
    <CoverSize>
      <Paper className={classes.paper}>
        <div className={classes.canvas}>
          <CoverCanvas/>
        </div>
      </Paper>
    </CoverSize>
  )
};

export default Cover
