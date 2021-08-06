import {useCallback, useState} from "react";

const BLANK_ERROR_MESSAGE = '';
const GENERIC_ERROR_MESSAGE = 'Sever Error';

const useRequestState = <DataType,>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(BLANK_ERROR_MESSAGE);
  const [data, setData] = useState<DataType | null>(null);
  const isError = errorMessage !== BLANK_ERROR_MESSAGE;

  const resetError = useCallback(() => {
    setErrorMessage(BLANK_ERROR_MESSAGE)
  }, []);

  const setGenericErrorMessage = useCallback(() => {
    setErrorMessage(GENERIC_ERROR_MESSAGE)
  }, []);

  return {
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    data,
    setData,
    isError,
    resetError,
    setGenericErrorMessage
  }
};

export default useRequestState
