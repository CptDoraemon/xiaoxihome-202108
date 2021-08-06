import React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import SectionLayout from "./SectionLayout";
import {MOBILE} from "../../theme";

const ARROW_WIDTH = 160;
export const ARROW_HEIGHT = 36;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(2),
    [MOBILE(theme)]: {
      marginBottom: theme.spacing(1),
    }
  },
  widthWrapper: {
    width: '100%',
    maxWidth: theme.breakpoints.values['lg'],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
    marginBottom: theme.spacing(6),
    textAlign: 'center'
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
}));

interface SectionTitleProps {
  title: string,
  subTitle: string
}

const SectionTitle = ({title, subTitle}: SectionTitleProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.widthWrapper}>
        <div className={classes.topArrow}> </div>
        <Typography variant={'h3'} component={'h2'} className={classes.title}>
          <span className={classes.titleTop}>{title}</span>
          <span className={classes.titleBottom}>{subTitle}</span>
        </Typography>
      </div>
    </div>
  )
};

export default SectionTitle
