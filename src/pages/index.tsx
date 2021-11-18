import {
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Heading,
  Flex,
  Code,
  Stack,
  Input,
  Button,
  Fade,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { QuoteForm } from "../components/QuoteForm";
import { TotalQuotes } from "../components/TotalQuotes";

import CountUp from "react-countup";

import axios from "axios";
import { IUser, QuotationResponse } from "../types";

const CurrentQuote = ({ quote }: { quote: QuotationResponse }) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <Stack spacing={0}>
      <Text fontSize="6xl" color="teal">
        $
        <CountUp
          useEasing
          end={Number(quote.total.toFixed(2))}
          duration={2}
        />{" "}
        {quote.currency_id} 🎉 🚀 🌒
      </Text>
      <Flex flexDirection="column" alignItems="baseline">
        <Text fontSize="sm" color="gray.500">
          Unique Quote Id: {quote.quotation_id}
        </Text>
        <Button
          size="sm"
          variant="link"
          onClick={() => setShowStats(!showStats)}
          color="gray.500"
        >
          Stats for nerds
        </Button>
        {showStats && (
          <Box width="100%" borderWidth="1px" borderRadius="lg" p={4} m={4}>
            <Code width="100%" fontSize="sm" color="gray.500">
              quotation_id: {quote.quotation_id} <br />
              currency_id: {quote.currency_id} <br />
              total: {quote.total.toFixed(2)} <br />
              <br />
              // would never show this in a real app obviously 🤷‍♂️ <br />
              token: {window.localStorage.getItem("token")} <br />
            </Code>
          </Box>
        )}
      </Flex>
    </Stack>
  );
};

const Home = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [quote, setQuote] = useState<QuotationResponse | null>(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user && window.localStorage.getItem("token")) {
      fetchUser();
    }
  }, [user]);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setUser(null);
    setQuote(null);
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
    <Container minHeight="100vh">
      <Hero />
      <Main>
        {user ? (
          <Flex flexDirection="column" justifyContent="space-between">
            <Box>
              {!quote ? (
                <Fade in={!!user && !quote}>
                  <Heading size="2xl">Welcome, {user.username}</Heading>
                  <Text mt={2} fontSize="lg" color="gray.500">
                    Let's get you a custom quote!
                  </Text>
                </Fade>
              ) : (
                <Fade in={!!quote}>
                  <Heading size="2xl">{user.username}'s custom quote:</Heading>
                  <CurrentQuote quote={quote} />
                </Fade>
              )}
            </Box>
            <QuoteForm setQuote={setQuote} />
            <Button
              maxWidth="fit-content"
              variant="link"
              colorScheme="teal"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </Flex>
        ) : (
          <>
            <Text fontSize="xl" fontWeight="bold" color="gray.500">
              Please log in to get started.
            </Text>
            <Formik
              initialValues={{ username: "" }}
              onSubmit={async (values, { setSubmitting }) => {
                await handleLogin(values.username);
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
      <TotalQuotes />
      <Footer color="gray.500">
        Devon Wells -- Battleface Fullstack Interview Challenge -- 11.2021
      </Footer>
      <CTA />
    </Container>
  );
};

export default Home;
