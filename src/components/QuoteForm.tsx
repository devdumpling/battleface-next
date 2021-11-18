import axios from "axios";

import {
  Link as ChakraLink,
  FormControl,
  FormLabel,
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
                <Field name="age" placeholder="Age">
                  {({ field }) => (
                    <FormControl id="age">
                      <FormLabel>Age</FormLabel>
                      <Input {...field} id="age" />
                      <FormHelperText>
                        It's free if you're under 18!
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>
                <Field name="currency_id" placeholder="Currency">
                  {({ field }) => (
                    <FormControl id="currency_id">
                      <FormLabel>Currency</FormLabel>
                      <Input {...field} id="currency_id" />
                      <FormHelperText>
                        Choose the currency you want to use (USD, EUR, etc)
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>
              </Flex>
              <Flex gridGap={4} justifyContent="space-between">
                <Field name="start_date" placeholder="Start Date">
                  {({ field }) => (
                    <FormControl id="start_date">
                      <FormLabel>
                        Start Date <Icon as={FaPlaneDeparture} />
                      </FormLabel>
                      <Input {...field} id="start_date" />
                      <FormHelperText>
                        When does your trip start? (YYYY-MM-DD)
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>
                <Field name="end_date" placeholder="End Date">
                  {({ field }) => (
                    <FormControl id="end_date">
                      <FormLabel>
                        End Date <Icon as={FaPlaneArrival} />
                      </FormLabel>
                      <Input {...field} id="end_date" />
                      <FormHelperText>
                        And when does it end? (YYYY-MM-DD)
                      </FormHelperText>
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
