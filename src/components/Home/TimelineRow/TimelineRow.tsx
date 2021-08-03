import React, {useCallback, useMemo, useState} from "react";
import {makeStyles} from "@material-ui/core";
import {TimelineDataItem} from "../timelineData";
import TopRow from "./TopRow";
import ContentRow from "./ContentRow";
import dynamic from "next/dynamic";

const DynamicGallery = dynamic(
  () => import('../TimelineRowGallery'),
  {ssr: false}
);

interface TimelineRowProps {
  previousItemYear: number | null,
  isLast?: boolean,
  data: TimelineDataItem
}

const useStyles = makeStyles((theme) => ({

}));

const TimelineRow = ({previousItemYear, isLast, data}: TimelineRowProps) => {
  const classes = useStyles();
  const isFirstItemInYear = useMemo(() => {
    return previousItemYear === null || previousItemYear !== data.year
  }, [data.year, previousItemYear]);

  const [galleryOpenCounter, setGalleryOpenCounter] = useState(0);
  const toggleGallery = useCallback(() => {
    setGalleryOpenCounter(prev => prev + 1)
  }, []);

  return (
    <>
      <TopRow dotSize={isFirstItemInYear ? 'lg' : 'sm'} title={data.title} year={isFirstItemInYear ? data.year.toString() : undefined}/>
      <ContentRow description={data.description} src={data.images[0]} onImageClick={toggleGallery}/>

      <DynamicGallery data={data.images} openCounter={galleryOpenCounter}/>
    </>
  )
};

export default TimelineRow
