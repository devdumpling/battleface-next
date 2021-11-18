import {
  Link as ChakraLink,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Heading,
  Flex,
  Stack,
  Input,
  Button,
  Fade,
} from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Formik, Form, Field } from "formik";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../utils/firebase/clientApp";

import axios from "axios";
import { IUser, QuotationRequest } from "../types";

const QuoteForm = () => {
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

const Home = () => {
  const [user, setUser] = useState<IUser | null>(null);

  /* const [quotes, quotesLoading, quotesError] = useCollection(
    collection(db, "quotes"),
    {}
  );

  console.log(quotes.docs.map((doc) => doc.data())); */

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setUser(null);
  };

  const handleLogin = async (username) => {
    try {
      const res = await axios.post(
        "/api/login",
        {
          username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200 && res.data?.token && res.data?.user) {
        // Using local storage is not ideal for prod! Vulnerable to XSS/CSRF attacks. This is just for demoing.
        // Better to use a secure cookie and/or access/refresh token pattern.
        // More discussion: 
        // https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id
        window.localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      } else {
        throw new Error("An unexpected error occurred.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container height="100vh">
      <Hero />
      <Main>
        {user ? (
          <Flex flexDirection="column" justifyContent="space-between">
            <Box>
              <Fade in={!!user}>
                <Heading size="2xl">Welcome, {user.username}</Heading>
                <Text mt={2} fontSize="lg" color="gray.500">
                  You are now logged in. Let's get you a quote.
                </Text>
              </Fade>
            </Box>
            <QuoteForm />
          </Flex>
        ) : (
          <>
            <Text fontSize="xl" fontWeight="bold" color="gray.500">
              Please log in to get started.
            </Text>
            <Formik
              initialValues={{ username: "" }}
              onSubmit={(values, { setSubmitting }) => {
                handleLogin(values.username);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="username" placeholder="Username">
                    {({ field }) => (
                      <FormControl id="username">
                        <FormLabel>Username</FormLabel>
                        <Input {...field} id="username" />
                        <FormHelperText>
                          Any username will work for now!
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    isLoading={isSubmitting}
                    mt={4}
                    colorScheme="teal"
                    type="submit"
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        )}
      </Main>

      <DarkModeSwitch />
      <Footer>
        <Text>Devon Wells -- Battleface Interview Challenge Nov 21</Text>
      </Footer>
      <CTA />
    </Container>
  );
};

export default Home;
