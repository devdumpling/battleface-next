import {
  Link as ChakraLink,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
import { IUser } from "../types";

const Home = () => {
  const [user, setUser] = useState<IUser | null>(null);

  /* const [quotes, quotesLoading, quotesError] = useCollection(
    collection(db, "quotes"),
    {}
  );

  console.log(quotes.docs.map((doc) => doc.data())); */

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
      if (res.status === 200 && res.data?.user) {
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
          <>
            <Fade in={!!user}>
              <Text fontSize="xl" fontWeight="bold" color="gray.500">
                Welcome back, {user.username}!
              </Text>

              <Text fontSize="lg" color="gray.500">
                You are now logged in.
              </Text>
            </Fade>
          </>
        ) : (
          <Text fontSize="xl" fontWeight="bold" color="gray.500">
            Please log in to get started.
          </Text>
        )}
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
      </Main>

      <DarkModeSwitch />
      <Footer>
        <Text>Devon Wells -- Battleface Interview Challenge 11.16.21</Text>
      </Footer>
      <CTA />
    </Container>
  );
};

export default Home;
