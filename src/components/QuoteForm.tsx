import axios from "axios";

import {
  Link as ChakraLink,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Stack,
  Icon,
  Flex,
  Input,
  Button,
} from "@chakra-ui/react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

import { QuotationRequest } from "../types";

import { Formik, Form, Field } from "formik";
import { useState } from "react";

interface QuoteFormProps {
  setQuote: (QuotationResponse) => void;
}

export const QuoteForm = ({ setQuote }: QuoteFormProps) => {
  const handleFetchQuote = async (params: QuotationRequest) => {
    try {
      const res = await axios.post(
        "/api/quotation",
        {
          ...params,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      );
      setQuote(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const validateAge = (age: string) => {
    let error;
    if (!age) {
      error = "Age is required";
    } else if (isNaN(Number(age)) || Number(age) < 0) {
      error = "Age must be a number";
    }
    return error;
  };

  const validateCurrency = (currency: string) => {
    let error;
    // check that currency is ISO 4217
    if (!currency) {
      error = "Currency is required";
    } else if (currency.length !== 3) {
      error = "Currency must be 3 characters matching ISO 4217";
    }
    return error;
  };

  const validateDate = (date: string) => {
    let error;
    if (!date) {
      error = "Date is required";
    }
    // regex to check that date is in ISO 8601 format
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      error = "Date must be in ISO 8601 (YYYY-MM-DD) format";
    }
    return error;
  };

  return (
    <Box my="2rem" width="100%">
      <Formik
        initialValues={{
          age: 28,
          currency_id: "",
          start_date: "",
          end_date: "",
        }}
        onSubmit={async (params, { setSubmitting }) => {
          await handleFetchQuote(params);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={8}>
              <Flex gridGap={4} justifyContent="space-between">
                <Field name="age" placeholder="Age" validate={validateAge}>
                  {({ field, form }) => (
                    <FormControl
                      id="age"
                      isInvalid={form.errors.age && form.touched.age}
                    >
                      <FormLabel>Age</FormLabel>
                      <Input {...field} id="age" />
                      <FormHelperText>
                        It's free if you're under 18!
                      </FormHelperText>
                      <FormErrorMessage>{form.errors.age}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field
                  name="currency_id"
                  placeholder="Currency"
                  validate={validateCurrency}
                >
                  {({ field, form }) => (
                    <FormControl
                      id="currency_id"
                      isInvalid={form.errors.currency_id}
                    >
                      <FormLabel>Currency</FormLabel>
                      <Input {...field} id="currency_id" />
                      <FormHelperText>
                        Choose the currency you want to use (USD, EUR, etc)
                      </FormHelperText>
                      <FormErrorMessage>
                        {form.errors.currency_id}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
              <Flex gridGap={4} justifyContent="space-between">
                <Field
                  name="start_date"
                  placeholder="Start Date"
                  validate={validateDate}
                >
                  {({ field, form }) => (
                    <FormControl
                      id="start_date"
                      isInvalid={form.errors.start_date}
                    >
                      <FormLabel>
                        Start Date <Icon as={FaPlaneDeparture} />
                      </FormLabel>
                      <Input {...field} id="start_date" />
                      <FormHelperText>
                        When does your trip start? (YYYY-MM-DD)
                      </FormHelperText>
                      <FormErrorMessage>
                        {form.errors.start_date}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field
                  name="end_date"
                  placeholder="End Date"
                  validate={validateDate}
                >
                  {({ field, form }) => (
                    <FormControl
                      id="end_date"
                      isInvalid={form.errors.end_date}
                    >
                      <FormLabel>
                        End Date <Icon as={FaPlaneArrival} />
                      </FormLabel>
                      <Input {...field} id="end_date" />
                      <FormHelperText>
                        And when does it end? (YYYY-MM-DD)
                      </FormHelperText>
                      <FormErrorMessage>
                        {form.errors.end_date}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
            </Stack>
            <Button
              isLoading={isSubmitting}
              mt={4}
              colorScheme="teal"
              type="submit"
            >
              Quote Me!
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
