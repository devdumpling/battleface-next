import axios from "axios";

import {
  Link as ChakraLink,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Stack,
  Input,
  Button,
} from "@chakra-ui/react";

import { QuotationRequest } from "../types";

import { Formik, Form, Field } from "formik";

export const QuoteForm = () => {
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
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box my="2rem">
      <Formik
        initialValues={{
          age: 28,
          currency_id: "",
          start_date: "",
          end_date: "",
        }}
        onSubmit={(params, { setSubmitting }) => {
          handleFetchQuote(params);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={4}>
              <Field name="age" placeholder="Age">
                {({ field }) => (
                  <FormControl id="age">
                    <FormLabel>Age</FormLabel>
                    <Input {...field} id="age" />
                    <FormHelperText>
                      It's free if you're under 18.
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
                      Choose the currency you want to use.
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
              <Field name="start_date" placeholder="Start Date">
                {({ field }) => (
                  <FormControl id="start_date">
                    <FormLabel>Start Date</FormLabel>
                    <Input {...field} id="start_date" />
                    <FormHelperText>
                      Choose the start date of your trip (YYYY-MM-DD).
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
              <Field name="end_date" placeholder="End Date">
                {({ field }) => (
                  <FormControl id="end_date">
                    <FormLabel>End Date</FormLabel>
                    <Input {...field} id="end_date" />
                    <FormHelperText>
                      Choose the end date of your trip (YYYY-MM-DD).
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
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
