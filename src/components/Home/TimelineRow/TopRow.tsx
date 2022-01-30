import React from "react";
import {makeStyles, Theme, Typography} from "@material-ui/core";
import {MOBILE} from "../../../theme";
import clsx from 'clsx';

export const getArrowWidth = (theme: Theme) => theme.spacing(2);
export const getYearWidth = (isMobile: boolean) => isMobile ? 40 : 60;
export const getDotWidth = (isMobile: boolean) => isMobile ? 40 : 80;

interface TopRowProps {
  dotSize: 'lg' | 'sm',
  year?: string,
  title: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  yearWrapper: {
    fontSize: theme.typography.h5.fontSize,
    width: getYearWidth(false),
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: '0 0 auto',
    [MOBILE(theme)]: {
      fontSize: theme.typography.body1.fontSize,
      width: getYearWidth(true),
    }
  },
  dotWrapper: {
    width: getDotWidth(false),
    flex: '0 0 auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [MOBILE(theme)]: {
      width: getDotWidth(true),
    }
  },
  dot: {
    backgroundColor: theme.palette.secondary.light,
    borderRadius: '50%',
    overflowY: 'hidden',
    margin: theme.spacing(1, 0)
  },
  dotLg: {
    width: 18,
    height: 18
  },
  dotSm: {
    width: 12,
    height: 12
  },
  titleWrapper: {
    flex: `0 0 calc(100% - ${getYearWidth(false) + getDotWidth(false)}px)`,
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: getArrowWidth(theme),
    [MOBILE(theme)]: {
      flex: `0 0 calc(100% - ${getYearWidth(true) + getDotWidth(true)}px)`,
    }
  },
  title: {
    position: 'relative',
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1, 2),
    // maxWidth: '100%',
    textTransform: 'capitalize',
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      right: '100%',
      width: getArrowWidth(theme),
      height: '50%',
    },
    '&:before': {
      top: 0,
      background: `linear-gradient(to left top, ${theme.palette.secondary.main} 50%, transparent 50%)`
    },
    '&:after': {
      bottom: 0,
      background: `linear-gradient(to left bottom, ${theme.palette.secondary.main} 50%, transparent 50%)`
    },
  }
}));

const TopRow = ({dotSize, year, title}: TopRowProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.yearWrapper}>
        {year}
      </div>
      <div className={classes.dotWrapper}>
        <div className={clsx(
          classes.dot,
          dotSize === "lg" && classes.dotLg,
          dotSize === 'sm' && classes.dotSm
        )}/>
      </div>
      <div className={classes.titleWrapper}>
        <Typography component='h3' variant='h5' className={classes.title}>
          {title}
        </Typography>
      </div>
    </div>
  )
};

export default TopRow
