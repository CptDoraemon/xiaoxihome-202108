import React, {useEffect} from "react";
import useTimelineRowGallery from "./useTimelineRowGallery";
import {usePrevious} from "react-use";
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';

interface TimelineRowGalleryProps {
  data: Array<StaticImageData>,
  openCounter: number
}

const TimelineRowGallery = ({data, openCounter}: TimelineRowGalleryProps) => {
  const {
    elRef,
    open
  } = useTimelineRowGallery(data);

  const previousCounter = usePrevious(openCounter);
  useEffect(() => {
    if (previousCounter !== openCounter && previousCounter !== undefined) {
      open()
    }
  }, [open, openCounter, previousCounter]);

  return (
    <div ref={elRef}>

    </div>
  )
};

export default TimelineRowGallery
