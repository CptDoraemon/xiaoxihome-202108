import Joi from 'joi';
import useInputFieldState from "../../../utils/useInputFieldState";
import useRequestState from "../../../utils/useRequestState";
import React, {useCallback} from "react";
import axios from "axios";

const schema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100),
  email: Joi.string().email({ tlds: { allow: false } })
    .min(2)
    .max(100),
  message: Joi.string()
    .min(10)
    .max(1000)
})

const useForm = () => {
  const name = useInputFieldState('');
  const email = useInputFieldState('');
  const message = useInputFieldState('');
  const requestState = useRequestState<string>();

  const handleSubmit = useCallback(async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      [name, email, message].forEach(obj => obj.resetError());
      requestState.resetError();
      requestState.setIsLoading(true);

      const validationResult = schema.validate({
        name: name.value,
        email: email.value,
        message: message.value
      }, {
        abortEarly: false
      });

      if (validationResult.error?.details.length) {
        const states: {[key: string]: ReturnType<typeof useInputFieldState>} = {
          name,
          email,
          message
        };
        validationResult.error.details.forEach(obj => {
          const key = obj.context?.key;
          if (key && states[key]) {
            states[key].setErrorMessage(obj.message)
          }
        });
        return
      }

      const res = await axios.post('https://api.xiaoxihome.com/api/xiaoxihome/feedback', {
        name: name.value,
        email: email.value,
        message: message.value
      })
      if (res.data.status === 'ok') {
        requestState.setData(`Thank you! I'll get back to you shortly.`);
      } else {
        requestState.setErrorMessage(res.data.message);
      }
    } catch (e) {
      requestState.setGenericErrorMessage();
    } finally {
      requestState.setIsLoading(false)
    }
  }, [email, message, name, requestState])

  return {
    name,
    email,
    message,
    handleSubmit,
    requestState
  }
}

export default useForm
