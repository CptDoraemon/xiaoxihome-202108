import React, {useMemo} from "react";
import {alpha, Button, CircularProgress, Collapse, darken, Grow, lighten, makeStyles} from "@material-ui/core";
import SectionLayout from "../SectionLayout";
import MyTextField from "./MyTextField";
import useForm from "./useForm";
import {Alert, AlertTitle} from "@material-ui/lab";
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    width: '100%',
    padding: theme.spacing(2)
  },
  button: {
    width: '100%',
    maxWidth: 600,
    height: 50,
    fontSize: theme.typography.h6.fontSize,
    margin: theme.spacing(2, 0, 2, 0),
    border: `1px solid ${theme.palette.text.secondary}`,
    color: theme.palette.text.secondary,
    '&:hover, &:focus': {
      backgroundColor: alpha(theme.palette.text.secondary, 0.16),
      color: '#fff',
    },
    '&:disabled': {
      backgroundColor: alpha(theme.palette.text.secondary, 0.08),
      color: alpha(theme.palette.text.secondary, 0.32),
    },
  },
  spinner: {
    marginRight: theme.spacing(2),
    color: 'inherit'
  },
  collapse: {
    width: '100%',
    maxWidth: 600,
  },
  alert: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
  alertSuccess: {
    backgroundColor: alpha(theme.palette.success.main, 0.16),
    color: theme.palette.success.main
  },
  alertError: {
    backgroundColor: alpha(theme.palette.error.main, 0.16),
    color: theme.palette.error.main
  }
}));

interface HireFormProps {}

const HireForm = () => {
  const classes = useStyles();
  const {
    name,
    email,
    message,
    handleSubmit,
    requestState
  } = useForm();

  const disableAll = useMemo(() => {
    return requestState.isLoading || requestState.data !== null
  }, [requestState.data, requestState.isLoading]);

  return (
    <SectionLayout>
      <form className={classes.form} onSubmit={handleSubmit}>
        <MyTextField inputStates={name} label={'Name'} disabled={disableAll}/>
        <MyTextField inputStates={email} label={'Email'} disabled={disableAll}/>
        <MyTextField inputStates={message} label={'Message'} multiline={true} minRows={3} disabled={disableAll}/>

        <Collapse in={requestState.data !== null} className={classes.collapse}>
          <Alert severity="success" className={clsx(classes.alert, classes.alertSuccess)}>
            <AlertTitle>
              Message Received
            </AlertTitle>
            {requestState.data || 'placeholder'}
          </Alert>
        </Collapse>

        <Collapse in={requestState.isError} className={classes.collapse}>
          <Alert severity="error" className={clsx(classes.alert, classes.alertError)}>
            <AlertTitle>
              Ooops
            </AlertTitle>
            {requestState.errorMessage}
          </Alert>
        </Collapse>

        <Button
          variant={'outlined'}
          size={'large'}
          disableElevation
          className={classes.button}
          startIcon={requestState.isLoading && <CircularProgress size={25} className={classes.spinner}/>}
          type={'submit'}
          disabled={disableAll}
        >
          {
            requestState.isLoading ?
              'Submitting' :
              requestState.data !== null ?
                'Submitted' :
                'Submit'
          }
        </Button>
      </form>
    </SectionLayout>
  )
};

export default HireForm
