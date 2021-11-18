import {
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Heading,
  Flex,
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

import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../utils/firebase/clientApp";

import axios from "axios";
import { IUser, QuotationResponse } from "../types";

const CurrentQuote = ({ quote }: { quote: QuotationResponse }) => (
  <Box>
    <Heading as="h2" size="lg" mb="2rem">
      ${quote.total}
    </Heading>
  </Box>
);

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
                <Heading size="2xl">Welcome, {user.username}.</Heading>
                <Text mt={2} fontSize="lg" color="gray.500">
                  Let's get you a custom quote!
                </Text>
              </Fade>
            </Box>
            {quote && <CurrentQuote quote={quote} />}
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
