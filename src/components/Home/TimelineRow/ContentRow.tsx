import React from "react";
import {Button, makeStyles, Typography, Link as MuiLink} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {getArrowWidth, getDotWidth, getYearWidth} from "./TopRow";
import {MOBILE} from "../../../theme";
import ImageWrapper from "../ImageWrapper";
import Link from 'next/link'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(1),
    paddingLeft: getYearWidth(false) + getDotWidth(false) + getArrowWidth(theme),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    [MOBILE(theme)]: {
      paddingLeft: getYearWidth(true) + getDotWidth(true) + getArrowWidth(theme),
    }
  },
  left: {
    flex: '0 0 50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    [MOBILE(theme)]: {
      flex: '0 0 100%',
    }
  },
  right: {
    flex: '0 0 50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(4, 0, 0, 0),
    [MOBILE(theme)]: {
      flex: '0 0 100%',
      padding: theme.spacing(0),
    }
  },
  description: {
    paddingRight: theme.spacing(4),
    [MOBILE(theme)]: {
      paddingRight: theme.spacing(2),
    },
    '& ul': {
      margin: 0,
      padding: 0
    },
    '& li': {
      margin: theme.spacing(2.5, 0),
      padding: 0,
      lineHeight: 1.75
    }
  },
  linkButtonsGroup: {
    margin: theme.spacing(0, -1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  linkButton: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    }
  },
}));

interface ContentRowProps {
  description: string | JSX.Element,
  src: StaticImageData,
  onImageClick: () => void,
  githubLink?: string,
  demoLink?: string
}

const ContentRow = ({description, src, onImageClick, githubLink, demoLink}: ContentRowProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={classes.linkButtonsGroup}>
          {
            githubLink &&
            <Link href={githubLink} passHref>
              {/* @ts-ignore */}
              <Button
                variant="contained"
                disableElevation
                className={classes.linkButton}
                startIcon={<GitHubIcon/>}
                size={'small'}
                component={MuiLink}
                target={'_blank'}
                rel={'noopener'}
              >
                GitHub
              </Button>
            </Link>
          }
          {
            demoLink &&
            <Link href={demoLink} passHref>
              {/* @ts-ignore */}
              <Button
                variant="contained"
                disableElevation
                className={classes.linkButton}
                startIcon={<OpenInNewIcon />}
                size={'small'}
                component={MuiLink}
                target={'_blank'}
                rel={'noopener'}
              >
                Demo
              </Button>
            </Link>
          }
        </div>
        <Typography component='p' variant='body1' className={classes.description}>
          {description}
        </Typography>
      </div>
      <div className={classes.right}>
        <ImageWrapper src={src} onClick={onImageClick} />
      </div>
    </div>
  )
};

export default ContentRow
