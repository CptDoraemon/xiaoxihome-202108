import React, {useCallback, useEffect, useRef, useState} from "react";
import {alpha, Button, Collapse, lighten, makeStyles, Typography, Link as MuiLink} from "@material-ui/core";
import {useMount, usePrevious, useUnmount} from "react-use";
import main from "./main";
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import GitHubIcon from '@material-ui/icons/GitHub';
import {MOBILE} from "../../../theme";
import Link from 'next/link'

const PANEL_COLOR = '#90caf9';
const PANEL_SECONDARY_COLOR = '#ef9a9a';

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
    },
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
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    position: 'absolute',
    zIndex: 3,
    perspective: 100,
  },
  controlPanel: {
    transform: 'rotate3d(0, -1, 0, 4deg)',
    transformOrigin: '100% 100%',
  },
  controlPanelItem: {
    maxWidth: 230,
    width: '100%',
    padding: theme.spacing(2, 2),
    margin: theme.spacing(0.5, 0),
    backgroundColor: alpha(PANEL_COLOR, 0.08),
    borderRadius: 8,
    filter: `drop-shadow(0px 0px 16px ${lighten(PANEL_COLOR, 0.5)})`,
    border: `solid 2px ${alpha(PANEL_COLOR, 0.14)}`,
    color: lighten(PANEL_COLOR, 0.5),
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [MOBILE(theme)]: {
      maxWidth: 160,
      padding: theme.spacing(0.25, 0.5),
    }
  },
  textWrapper: {
    padding: theme.spacing(0, 1),
    fontWeight: 'inherit',
    textAlign: 'end',
    [MOBILE(theme)]: {
      padding: theme.spacing(0.5, 0.5),
    }
  },
  cameraButton: {
    color: 'inherit',
    fontWeight: 'inherit',
    textDecoration: 'none',
    '&:hover, &:focus': {
      textDecoration: 'none',
    },
    '&:hover': {
      background: alpha(PANEL_COLOR, 0.14)
    },
    '& span': {
      color: 'inherit',
      fontWeight: 'inherit',
      fontSize: '0.8rem',
      textTransform: 'none'
    }
  },
  secondaryText: {
    color: PANEL_SECONDARY_COLOR,
    textDecoration: 'none',
    '&:hover, &:focus': {
      textDecoration: 'none',
      color: PANEL_COLOR,
      outline: 'none'
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
  const [collapseIn, setCollapseIn] = useState(-1);
  const timeoutRef = useRef<number | null>(null);

  const registerCollapseIn = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      setCollapseIn(prev => prev === 2 ? 2 : prev + 1);
      timeoutRef.current = null;
    }, 2000)
  }, []);

  useMount(async () => {
    babylonCallbacksRef.current = await main(id);
    setBabylonReady(true);
    registerCollapseIn()
  });

  const previousCollapseIn = usePrevious(collapseIn);
  useEffect(() => {
    if (previousCollapseIn !== undefined && previousCollapseIn !== collapseIn) {
      registerCollapseIn()
    }
  }, [collapseIn, previousCollapseIn, registerCollapseIn]);

  useUnmount(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  })

  return (
    <div className={classes.root}>
      <canvas id={id}/>

      <div className={classes.touchLayer}>
        {
          babylonReady &&
          <div className={classes.controlPanelTransformRoot}>
            <div className={classes.controlPanel}>
              <Collapse in={collapseIn >= 0}>
                <div className={classes.controlPanelItem}>
                  <Typography variant={'body2'} className={classes.textWrapper}>
                    {'Hello there, this is Xiaoxi. You found my home, please '}
                    <Link href={'/#timeline'} passHref>
                      <MuiLink className={classes.secondaryText}>scroll down</MuiLink>
                    </Link>
                    {' to read more.'}
                  </Typography>
                </div>
              </Collapse>

              <Collapse in={collapseIn >= 1}>
                <div className={classes.controlPanelItem}>
                  <Link href={'https://github.com/CptDoraemon'} passHref>
                    <Button
                      endIcon={<GitHubIcon/>}
                      className={classes.cameraButton}
                      component={MuiLink}
                      target={'_blank'}
                      rel={'noopener'}
                    >
                      GitHub
                    </Button>
                  </Link>

                  <Link href={'https://cptdoraemon.github.io/discussion-board-client/'} passHref>
                    <Button
                      endIcon={<LibraryBooksIcon/>}
                      className={classes.cameraButton}
                      component={MuiLink}
                      target={'_blank'}
                      rel={'noopener'}
                    >
                      Blog
                    </Button>
                  </Link>
                </div>
              </Collapse>

              <Collapse in={collapseIn >= 2}>
                <div className={classes.controlPanelItem}>
                  <Button
                    endIcon={<FlipCameraIosIcon/>}
                    className={classes.cameraButton}
                    onClick={babylonCallbacksRef.current?.switchCamera}
                  >
                    Switch Camera
                  </Button>
                </div>
              </Collapse>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default CoverCanvas
