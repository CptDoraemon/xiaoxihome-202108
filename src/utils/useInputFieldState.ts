import React, {useCallback, useEffect, useState} from "react";
import {usePrevious} from "react-use";

const emptyErrorMessage = '';

const useInputFieldState = (
  initialValue: string,
) => {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState(emptyErrorMessage);
  const isError = errorMessage !== emptyErrorMessage;

  const resetError = useCallback(() => {
    setErrorMessage(emptyErrorMessage)
  }, []);

  const resetValue = useCallback(() => {
    setValue(initialValue)
  }, [initialValue]);

  const reset = useCallback(() => {
    resetError();
    resetValue();
  }, [resetError, resetValue])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }, []);

  // reset error on value change
  const previousValue = usePrevious(value);
  useEffect(() => {
    if (previousValue !== value) {
      resetError()
    }
  }, [previousValue, resetError, value])

  return {
    value,
    setValue,
    handleChange,
    errorMessage,
    setErrorMessage,
    isError,
    resetError,
    resetValue,
    reset
  }
}

export default useInputFieldState
