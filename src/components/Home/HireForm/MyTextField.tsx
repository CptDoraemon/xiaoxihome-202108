import React from "react";
import {
  Collapse,
  darken,
  FormControl,
  FormHelperText,
  InputLabel,
  lighten,
  makeStyles, OutlinedInput
} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import useInputFieldState from "../../../utils/useInputFieldState";

const getPrimaryColor = (theme: Theme) => theme.palette.text.secondary;
const getHighlightColor = (theme: Theme) => lighten(theme.palette.text.secondary, 0.5);
const getDisabledColor = (theme: Theme) => darken(theme.palette.text.secondary, 0.5);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 600,
    margin: theme.spacing(1, 0),
    '& label': {
      color: getPrimaryColor(theme),
      // backgroundColor: theme.palette.primary.main
    },
    '& label.Mui-focused': {
      color: getHighlightColor(theme)
    },
    '& label.Mui-disabled': {
      color: getDisabledColor(theme)
    },
    '&:hover label': {
      color: getHighlightColor(theme)
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused': {
        background: lighten(theme.palette.primary.dark, 0.1),
      },
      '& fieldset': {
        borderColor: getPrimaryColor(theme),
      },
      '&:hover fieldset': {
        borderColor: getHighlightColor(theme)
      },
      '&.Mui-focused fieldset': {
        borderColor: getHighlightColor(theme)
      },
      '&.Mui-disabled fieldset': {
        borderColor: getDisabledColor(theme)
      },
      '&.Mui-focused input, &.Mui-focused textarea': {
        color: '#fff'
      },
      '& input, & textarea': {
        color: getPrimaryColor(theme),
      },
      '&.Mui-disabled input, &.Mui-disabled textarea': {
        color: getDisabledColor(theme),
      },
    },
  },
}));

type MyTextFieldProps = {
  inputStates: ReturnType<typeof useInputFieldState>,
  disabled?: boolean,
  label: string,
  multiline?: boolean,
  minRows?: number
}

const MyTextField = ({inputStates, disabled, label, multiline, minRows}: MyTextFieldProps) => {
  const classes = useStyles();
  const baseID = `text-field-${label}`;
  const helperTextID = `${baseID}-helper-text`;

  return (
    <FormControl className={classes.root} variant={'outlined'}>
      <InputLabel
        htmlFor={baseID}
        variant={'outlined'}
        shrink={true}
        disabled={disabled}
        error={inputStates.isError}
      >
        {label}
      </InputLabel>
      <OutlinedInput
        id={baseID}
        aria-describedby={helperTextID}
        value={inputStates.value}
        disabled={disabled}
        error={inputStates.isError}
        onChange={inputStates.handleChange}
        label={label}
        notched={true}
        multiline={multiline}
        minRows={minRows}
      />
      {
        <Collapse in={inputStates.isError}>
          <FormHelperText
            id={helperTextID}
            error={inputStates.isError}
          >{inputStates.errorMessage || ' '}</FormHelperText>
        </Collapse>
      }
    </FormControl>
  )
};

export default MyTextField
