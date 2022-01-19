import React from "react";
import {makeStyles} from "@material-ui/core";
import {useMount} from "react-use";
import main from "./main";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    '& canvas': {
      width: '100%',
      height: '100%',
    }
  }
}));

interface CoverCanvasProps {}

const CoverCanvas = () => {
  const classes = useStyles();
  const id = 'cover-canvas';
  useMount(() => main(id));

  return (
    <div className={classes.root}>
      <canvas id={id}/>
    </div>
  );
};

export default CoverCanvas
