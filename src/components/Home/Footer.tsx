import React, {useMemo} from "react";
import {Container, darken, makeStyles, Paper, Typography} from "@material-ui/core";

interface FooterProps {}

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(4, 4),
    backgroundColor: darken(theme.palette.primary.main, 0.3),
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  copyright: {
    fontWeight: 700
  }
}));

const Footer = () => {
  const classes = useStyles();
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  return (
    <Container maxWidth={'lg'} disableGutters>
      <Paper className={classes.paper}>
        <Typography variant={'body2'} component={'div'} className={classes.copyright}>
          &copy;{` XiaoxiHome.com 2018-${currentYear}`}
        </Typography>
      </Paper>
    </Container>
  )
};

export default Footer
