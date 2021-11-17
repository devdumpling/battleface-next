import {
  Link as ChakraLink,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
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
import React from "react";

import axios from "axios";

const Home = () => {
  const [username, setUsername] = useState("");

  const handleLogin = async (username) => {
    try {
      const res = await axios.post("/api/login", {
        username,
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container height="100vh">
      <Hero />
      <Main>
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
      {/* <CTA /> */}
    </Container>
  );
};

export default Home;
