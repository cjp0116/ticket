import React from "react";
import { Transition, Message, Icon } from "semantic-ui-react";
const ErrorMessages = ({ errors }) => {
  const errorMessages = [];
  for (const error of errors) {
    for (const key in error) {
      errorMessages.push(error[key]);
    }
  }
  return errorMessages.map((e, i) => (
    <Transition visible animation="scale" key={i} duration={300}>
      <Message size="small" floating error>
        <Icon name="exclamation circle" />
        {e}
      </Message>
    </Transition>
  ));
};

export default ErrorMessages;
