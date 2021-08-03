import React from "react";
import {Button, createStyles, IconButton, Link, makeStyles, Paper, Theme, Typography} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import clsx from "clsx";
import SlideUpText from "./SlideUpText";
import {MOBILE} from "../../theme";
import useGetFullscreenHeight from "../../utils/useGetFullscreenHeight";
import {ARROW_HEIGHT} from "./Timeline";

interface CoverProps {}

const useStyles = makeStyles((theme) => {
  const rowWidth = {
    padding: theme.spacing(0, 2),
    width: '100%',
    maxWidth: 1600,
  };

  return {
    root: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(4),
      [MOBILE(theme)]: {
        padding: theme.spacing(2, 0),
      }
    },
    paper: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.secondary.main,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    topRow: {
      ...rowWidth,
      height: 80,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    bottomRow: {
      ...rowWidth,
      height: 80,
    },
    linkButton: {
      '&:hover, &:focus': {
        color: theme.palette.primary.contrastText,
        transition: theme.transitions.create('color')
      }
    },
    rowWrapper: {
      ...rowWidth,
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      [MOBILE(theme)]: {
        flexDirection: 'column',
      }
    },
    row: {
      height: '100%',
      padding: theme.spacing(2),
      flex: '1 0 50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      [MOBILE(theme)]: {
        height: '50%',
      }
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: theme.spacing(2, 0)
    },
    title: {
      fontWeight: 700,
      color: theme.palette.primary.contrastText,
      marginTop: theme.spacing(2)
    },
    subTitle: {
      color: theme.palette.primary.contrastText,
    },
    button: {
      width: 200,
      height: 60,
      textTransform: 'none',
      fontSize: theme.typography.h5.fontSize,
      fontWeight: 600,
      marginTop: theme.spacing(4)
    }
  }
});

const Cover = () => {
  const classes = useStyles();
  const vh = useGetFullscreenHeight();

  return (
    <div className={classes.root} style={{height: vh - ARROW_HEIGHT * 0.5}}>
      <Paper className={classes.paper}>
        <div className={classes.topRow}>
          <IconButton className={classes.linkButton} component={Link} href={'https://github.com/CptDoraemon'} target={'_blank'} rel={'noreferrer noopenner'} edge={'start'}>
            <GitHubIcon />
          </IconButton>
        </div>

        <div className={classes.rowWrapper}>
          <div className={classes.row}>
            <div className={classes.titleWrapper}>
              <Typography variant={'h5'} component={'h2'} className={clsx(classes.subTitle)}>
                <SlideUpText baseDelay={200}>
                  Hi there, this is Xiaoxi (Jake)
                </SlideUpText>
              </Typography>
              <Typography variant={'h3'} component={'h1'} className={classes.title}>
                <SlideUpText baseDelay={300}>
                  Welcome to my home, I store my works here
                </SlideUpText>
              </Typography>
              <Button variant={'contained'} disableElevation className={classes.button} color={'primary'}>
                Read More
              </Button>
            </div>
          </div>
          <div className={classes.row}>

          </div>
        </div>

        <div className={classes.bottomRow}>

        </div>
      </Paper>
    </div>
  )
};

export default Cover
