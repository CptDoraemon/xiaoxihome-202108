import React, {JSX} from "react";
import {makeStyles} from "@material-ui/core";
import {MOBILE} from "../../theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(8),
    [MOBILE(theme)]: {
      marginBottom: theme.spacing(4),
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
}));

interface SectionLayoutProps {
  children: JSX.Element,
}

const SectionLayout = ({children}: SectionLayoutProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.widthWrapper}>
        {children}
      </div>
    </div>
  )
};

export default SectionLayout
