import React from "react";
import {makeStyles} from "@material-ui/core";
import timelineData from "./timelineData";
import TimelineRow from "./TimelineRow/TimelineRow";
import TheLine from "./TimelineRow/TheLine";
import SectionLayout from "./SectionLayout";

interface TimelineProps {}

const useStyles = makeStyles((theme) => ({
  timelineWrapper: {
    width: '100%',
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
    <SectionLayout>
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
    </SectionLayout>
  )
};

export default Timeline
