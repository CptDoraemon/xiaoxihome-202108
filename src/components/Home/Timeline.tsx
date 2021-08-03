import React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import timelineData from "./timelineData";
import TimelineRow from "./TimelineRow/TimelineRow";
import TheLine from "./TimelineRow/TheLine";

interface TimelineProps {}

const ARROW_WIDTH = 160;
export const ARROW_HEIGHT = 36;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative'
  },
  topArrow: {
    width: ARROW_WIDTH,
    height: ARROW_HEIGHT,
    backgroundColor: theme.palette.primary.light,
    position: 'relative',
    marginBottom: theme.spacing(2) + ARROW_HEIGHT,
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: 0,
      borderLeft: `solid ${ARROW_WIDTH / 2}px transparent`,
      borderRight: `solid ${ARROW_WIDTH / 2}px transparent`,
      borderTop: `solid ${ARROW_HEIGHT}px ${theme.palette.primary.light}`
    }
  },
  title: {
    display: 'block',
    width: '100%',
    marginBottom: theme.spacing(6)
  },
  titleTop: {
    display: 'block',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontWeight: 400,
    fontSize: '0.5em',
    textTransform: 'uppercase'
  },
  titleBottom: {
    display: 'block',
    textAlign: 'center',
    fontWeight: 400,
    color: theme.palette.primary.contrastText,
    textTransform: 'uppercase'
  },
  timelineWrapper: {
    width: '100%',
    maxWidth: theme.breakpoints.values['lg'],
    position: 'relative'
  },
  timelineWrapperInner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative'
  }
}));

const Timeline = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <div className={classes.topArrow}> </div>
      <Typography variant={'h3'} component={'h2'} className={classes.title}>
        <span className={classes.titleTop}>MY EXPERIENCE IN</span>
        <span className={classes.titleBottom}>WEB DEVELOPMENT</span>
      </Typography>
      <div className={classes.timelineWrapper}>
        <div className={classes.timelineWrapperInner} style={{zIndex: 2}}>
          {
            timelineData.map((item, i, arr) => (
              <TimelineRow key={i} data={item} previousItemYear={i === 0 ? null : arr[i-1].year} isLast={i === arr.length - 1}/>
            ))
          }
        </div>
        <TheLine zIndex={1}/>
      </div>
    </div>
  )
};

export default Timeline
