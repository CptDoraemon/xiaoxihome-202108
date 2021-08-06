import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core";
import Image from "next/image";
import clsx from "clsx";
import useIsInSight from "../../utils/useIsInSight";
import {useMount} from "react-use";
import useDebouncedCallback from "../../utils/useDebouncedCallback";

const IMAGE_BG_OFFSET = 1.5;
const EXTRA_PADDING = 1;

interface ImageWrapperProps {
  src: StaticImageData,
  onClick: () => void
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: `calc(100% - ${theme.spacing(IMAGE_BG_OFFSET + EXTRA_PADDING)}px)`,
    position: 'relative',
    margin: theme.spacing(IMAGE_BG_OFFSET + EXTRA_PADDING, IMAGE_BG_OFFSET + EXTRA_PADDING, 0, 0),
  },
  innerWrapper: {
    width: '100%',
    position: 'relative',
    filter: 'brightness(0.8)',
    cursor: 'pointer',
    '&:hover, &:focus': {
      filter: 'brightness(1.1)',
    },
  },
  bg: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: theme.palette.text.secondary,
  },
  payload: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: `translate(0, 0)`,
    transition: theme.transitions.create('transform', {delay: 300})
  },
  payloadLoaded: {
    transform: `translate(${theme.spacing(IMAGE_BG_OFFSET)}px, -${theme.spacing(IMAGE_BG_OFFSET)}px)`,
  }
}));

const ImageWrapper = ({src, onClick}: ImageWrapperProps) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const {
    isInSight,
    elRef
  } = useIsInSight<HTMLDivElement>();
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('0');

  const setDimensions = useCallback(() => {
    let maxWidth = 400;
    if (elRef.current) {
      maxWidth = Math.min(maxWidth, Math.floor(elRef.current.getBoundingClientRect().width))
    }
    const maxHeight = 250;
    let width = maxWidth;
    let height = maxHeight;
    const whRatio = src.height === 0 ? 1 : src.width / src.height;
    if (height * whRatio > width) {
      height = Math.round(width / whRatio);
    } else {
      width = Math.round(height * whRatio)
    }
    setWidth(`${width}px`);
    setHeight(`${height}px`)
  }, [elRef, src.height, src.width]);

  useMount(setDimensions);
  const debouncedSetDimensions = useDebouncedCallback(setDimensions, 300);

  useEffect(() => {
    window.addEventListener('resize', debouncedSetDimensions);
    return () => {
      window.removeEventListener('resize', debouncedSetDimensions);
    }
  }, [debouncedSetDimensions]);

  return (
    <div className={classes.root} ref={elRef}>
      <div className={classes.innerWrapper} onClick={onClick} style={{width, height}}>
        <div className={classes.bg} />
        <div className={clsx(classes.payload, loaded && isInSight && classes.payloadLoaded)}>
          <Image
            src={src}
            placeholder={'blur'}
            onLoad={() => setLoaded(true)}
            layout={'fill'}
          />
        </div>
      </div>
    </div>
  )
};

export default ImageWrapper
