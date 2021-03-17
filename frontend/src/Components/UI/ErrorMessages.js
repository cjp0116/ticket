import React from "react";
import { Transition, Message } from "semantic-ui-react";
const ErrorMessages = ({ errors }) => {
  if(!Array.isArray(errors)) return null;
  const errorMessages = [];
  for(const error of errors) {
    for(const key in error) {
      errorMessages.push(error[key])
    }
  };
  return errorMessages.map((e, i) => (
    <Transition visible animation="scale" key={i} duration={400}>
      <Message size="small" floating error> <b>Error : </b> {e}</Message>
    </Transition>
  ))
};

export default ErrorMessages;