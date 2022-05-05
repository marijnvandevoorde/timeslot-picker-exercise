import React from "react";

import { parseISO } from "date-fns";

import Button from "@atlaskit/button";
import Form, {
  Field,
  FormFooter,
  HelperMessage,
  ValidMessage,
  ErrorMessage
} from "@atlaskit/form";

import { DateTimePicker } from "@atlaskit/datetime-picker";

let startDate = new Date();
startDate.setDate(startDate.getDate() + 1);
startDate.setMinutes(60);
let fullDate = new Date();
fullDate.setDate(startDate.getDate() + 6);

var dirty = false;
var success = false;

const validateField = (value?: string) => {
  success = false;
  if (Number.isNaN(new Date(value).getTime())) {
    return "REQUIRED";
  }
  dirty = new Date(value).toISOString() !== startDate.toISOString();
  if (!value) {
    return "REQUIRED";
  } else if (new Date(value).getTime() < new Date().getTime() + 86400) {
    return "EXPIRED";
  }
  console.log("validate", success, dirty);
};

const weekendFilter = (date: string) => {
  if (
    new Date(date).toISOString().substring(5, 10) <
    startDate.toISOString().substring(5, 10)
  ) {
    return true;
  }
  if (new Date(date).getDate() === fullDate.getDate()) {
    return true;
  }

  const dayOfWeek = parseISO(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};
const submitTheForm = () => {
  success = true;
  alert("Thanks you for registering your slot");
  console.log("submit", success, dirty);
  return true;
};

const DateTimePickerFormExample = () => (
  <Form onSubmit={(formState: unknown) => submitTheForm()}>
    {({ formProps }) => (
      <form {...formProps}>
        <Field
          name="datetime-picker"
          label="Scheduled run time"
          validate={validateField}
          isRequired
          defaultValue={startDate.toISOString()}
        >
          {({ fieldProps, error, meta: { valid } }) => (
            <>
              <DateTimePicker
                timeFormat="HH:mm"
                timeIsEditable
                locale={"nl-BE"}
                datePickerProps={{
                  disabledDateFilter: weekendFilter,
                  weekStartDay: 1
                }}
                {...fieldProps}
              />
              {success && (
                <ValidMessage>Your timeslot has been registered.</ValidMessage>
              )}
              {valid && !success && dirty && (
                <ValidMessage>
                  Your timeslot is valid. Submit to register.
                </ValidMessage>
              )}
              {error === "REQUIRED" && (
                <ErrorMessage>This field is required</ErrorMessage>
              )}
              {dirty && error === "EXPIRED" && (
                <ErrorMessage>
                  The timeslot has to be at least 24 hours in the future.
                </ErrorMessage>
              )}
              {!dirty && !success && (
                <HelperMessage>
                  Please choose a slot for your delivery
                </HelperMessage>
              )}
            </>
          )}
        </Field>
        <FormFooter>
          <Button type="submit" appearance="primary">
            Submit
          </Button>
        </FormFooter>
      </form>
    )}
  </Form>
);

export default DateTimePickerFormExample;
