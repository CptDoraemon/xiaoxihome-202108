import React, {useState} from "react";
import {Button, makeStyles, Typography} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {getArrowWidth, getDotWidth, getYearWidth} from "./TopRow";
import {MOBILE} from "../../../theme";
import ImageWrapper from "../ImageWrapper";

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
    [MOBILE(theme)]: {
      flex: '0 0 100%',
    }
  },
  description: {
    paddingRight: theme.spacing(4),
    [MOBILE(theme)]: {
      paddingRight: theme.spacing(2),
    }
  },
  linkButtonsGroup: {
    margin: theme.spacing(0, -1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  linkButton: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.primary.main
  },
}));

interface ContentRowProps {
  description: string,
  src: StaticImageData,
  onImageClick: () => void
}

const ContentRow = ({description, src, onImageClick}: ContentRowProps) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={classes.linkButtonsGroup}>
          <Button
            variant="contained"
            disableElevation
            className={classes.linkButton}
            startIcon={<GitHubIcon />}
            size={'small'}
          >
            Code
          </Button>
          <Button
            variant="contained"
            disableElevation
            className={classes.linkButton}
            startIcon={<OpenInNewIcon />}
            size={'small'}
          >
            Demo
          </Button>
        </div>
        <Typography component='p' variant='h6' className={classes.description}>
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
