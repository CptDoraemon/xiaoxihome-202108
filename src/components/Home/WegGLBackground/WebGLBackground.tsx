import React, {useRef} from "react";
import {makeStyles} from "@material-ui/core";
import useWebGLBackground from "./useWebGLBackground";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%'
  }
}));

interface WebGlBackgroundProps {
  canMount: boolean
}

const WebGlBackground = ({canMount}: WebGlBackgroundProps) => {
  const classes = useStyles();
  const {
    containerRef
  } = useWebGLBackground<HTMLDivElement>(canMount);
  
  return (
    <div ref={containerRef} className={classes.root}/>
  )
};

export default WebGlBackground
