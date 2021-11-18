import { Flex, Text, Spinner } from "@chakra-ui/react";
import { collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../utils/firebase/clientApp";
import CountUp from "react-countup";

export const TotalQuotes = () => {
  const [quotes, loading] = useCollection(collection(db, "quotes"), {});
  const [totalQuotes, setTotalQuotes] = useState(0);

  useEffect(() => {
    if (quotes && quotes.docs) {
      setTotalQuotes(quotes.docs.length);
    }
  }, [quotes]);

  const quoteAverage =
    quotes?.docs?.reduce((acc, curr) => {
      const { total } = curr.data();
      if (total !== undefined && total !== null) {
        return acc + total;
      }
      return acc;
    }, 0) / (totalQuotes || 1);

  return (
    <Flex p={2} gridGap={2} position="fixed" top="1rem" left="1rem">
      {loading && <Spinner color="teal.500" size="sm" />}
      {quotes && (
        <>
          <Text fontSize="sm" color="gray.500">
            Quotes:
          </Text>

          <Text fontSize="sm" fontWeight="bold" color="teal.500">
            <CountUp preserveValue end={totalQuotes} duration={2} useEasing />
          </Text>
          <Text fontSize="sm" color="gray.500">
            Avg Quote:
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="teal.500">
            $<CountUp preserveValue end={quoteAverage} duration={2} useEasing />
          </Text>
        </>
      )}
    </Flex>
  );
};
