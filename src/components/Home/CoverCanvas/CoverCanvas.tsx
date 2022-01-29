import React, {useRef, useState} from "react";
import {alpha, Button, IconButton, lighten, makeStyles, Typography} from "@material-ui/core";
import {useMount} from "react-use";
import main from "./main";
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import {MOBILE} from "../../../theme";

const PANEL_COLOR = '#90caf9';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    '& canvas': {
      width: '100%',
      height: '100%',
      outline: 'none',
      zIndex: 1
    }
  },
  touchLayer: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  controlPanelTransformRoot: {
    perspective: 100,
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    position: 'absolute',
    zIndex: 3,
  },
  controlPanel: {
    padding: theme.spacing(2, 4),
    backgroundColor: alpha(PANEL_COLOR, 0.08),
    transform: 'rotate3d(0, -1, 0, 5deg)',
    transformOrigin: 'center center',
    borderRadius: 8,
    filter: `drop-shadow(0px 0px 16px ${lighten(PANEL_COLOR, 0.5)})`,
    border: `solid 2px ${alpha(PANEL_COLOR, 0.14)}`,
    [MOBILE(theme)]: {
      padding: theme.spacing(0.25, 0.5),
    }
  },
  cameraButton: {
    color: lighten(PANEL_COLOR, 0.5),
    '&:hover': {
      background: 'transparent'
    },
    '& span': {
      color: 'inherit',
      fontWeight: 700,
      fontSize: '0.8rem'
    }
  }
}));

interface CoverCanvasProps {}

type Awaited<T> = T extends PromiseLike<infer U> ? U : T
const CoverCanvas = () => {
  const classes = useStyles();
  const id = 'cover-canvas';
  const babylonCallbacksRef = useRef<Awaited<ReturnType<typeof main>>>();
  const [babylonReady, setBabylonReady] = useState(false);

  useMount(async () => {
    babylonCallbacksRef.current = await main(id);
    setBabylonReady(true);
  });

  return (
    <div className={classes.root}>
      <canvas id={id}/>

      <div className={classes.touchLayer}>
        {
          babylonReady &&
          <div className={classes.controlPanelTransformRoot}>
            <div className={classes.controlPanel}>
              <Button
                endIcon={<FlipCameraIosIcon/>}
                className={classes.cameraButton}
                onClick={babylonCallbacksRef.current?.switchCamera}
              >
                Switch Camera
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default CoverCanvas
