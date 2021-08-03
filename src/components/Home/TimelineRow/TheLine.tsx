import React from "react";
import {makeStyles} from "@material-ui/core";
import {MOBILE} from "../../../theme";
import {getDotWidth, getYearWidth} from "./TopRow";

interface TheLineProps {
  zIndex: number
}

const TOP_MARGIN = 24;

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  lineDimension: {
    width: 4,
    height: `calc(100% - ${TOP_MARGIN}px)`,
    marginLeft: getYearWidth(false) + getDotWidth(false) / 2,
    marginTop: TOP_MARGIN,
    transform: 'translateX(-50%)',
    position: 'relative',
    [MOBILE(theme)]: {
      marginLeft: getYearWidth(true) + getDotWidth(true) / 2,
    }
  },
  line: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.primary.light} 20%, transparent 40%)`,
    backgroundSize: '100% 12px',
    backgroundRepeat: 'repeat-y',
    backgroundPosition: '0 0',
  },
  // movingLine: {
  //   width: '200%',
  //   height: '100%',
  //   transform: 'translateX(-50%)',
  //   position: 'absolute',
  //   top: 0,
  //   left: '50%',
  //   background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.primary.light} 40%, ${theme.palette.primary.light} 60%, transparent 100%)`,
  //   backgroundSize: '100% 48px',
  //   backgroundRepeat: 'no-repeat',
  //   backgroundPosition: '0 0',
  //   animationName: '$move',
  //   animationDuration: '10000ms',
  //   animationIterationCount: 'infinite',
  //   animationTimingFunction: 'linear'
  //
  // },
  // '@keyframes move': {
  //   from: {backgroundPosition: '0 0'},
  //   to: {backgroundPosition: '0 110%'}
  // },
}));

const TheLine = ({zIndex}: TheLineProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{zIndex}}>
      <div className={classes.lineDimension}>
        <div className={classes.line}>

        </div>
        {/*<div className={classes.movingLine}>*/}

        {/*</div>*/}
      </div>
    </div>
  )
};

export default TheLine
