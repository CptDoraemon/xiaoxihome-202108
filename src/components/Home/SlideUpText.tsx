import React, {useState} from "react";
import {makeStyles} from "@material-ui/core";
import {useMount} from "react-use";
import useIsInSight from "../../utils/useIsInSight";
import clsx from "clsx";

const ANIMATION_DURATION = 500;

interface SlideUpTextProps {
  children: string,
  baseDelay: number
}

const useStyles = makeStyles((theme) => ({
  word: {
    display: 'inline-block',
    marginRight: '0.5ch',
    overflow: 'hidden',
    lineHeight: '1.3'
  },
  wordInner: {
    display: 'inline-block',
    transform: 'translateY(110%)',
  },
  slideUpAnimation: {
    animationName: '$slideUp',
    animationDuration: `${ANIMATION_DURATION}ms`,
    animationIterationCount: 1,
    animationTimingFunction: 'ease-out',
    animationFillMode: 'forwards'
  },
  '@keyframes slideUp': {
    '0%': {transform: 'translateY(110%)'},
    '100%': {transform: 'translateY(0)'}
  },
}));

const SlideUpText = ({children, baseDelay}: SlideUpTextProps) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const {
    isInSight,
    elRef
  } = useIsInSight();

  useMount(() => {
    setLoaded(true)
  });

  if (!loaded) {
    return <span style={{opacity: 0}}>{children}</span>
  }

  return (
    <>
      {
        !loaded && <span style={{opacity: 0}}>{children}</span>
      }
      {
        loaded && children.split(' ').map((word, i) => (
        <span key={i} className={classes.word}>
          <span
            className={clsx(classes.wordInner, isInSight && classes.slideUpAnimation)}
            style={{animationDelay: `${i * ANIMATION_DURATION * 0.1 + baseDelay}ms`}}
          >
            {word}
          </span>
        </span>
        ))
      }

      <span ref={elRef}> </span>
    </>
  )
};

export default SlideUpText
