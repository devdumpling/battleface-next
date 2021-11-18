import { FIXED_RATE, AGE_LOAD_TIERS } from "./constants";

const validateDates = (start_date: string, end_date: string) => {
  const start = new Date(start_date);
  const end = new Date(end_date);

  // <= because it seems reasonable to provide travel insurance for only one day
  // Hopefully this assumptions makes sense but if not just make this <
  return start <= end;
};

const validateAge = (age: number) => {
  return age > 0;
};

// Calculate the total cost of the quote
const calcTotal = (age: number, start_date: string, end_date: string) => {
  const tripLength = calcTripLength(start_date, end_date);
  const ageMultiplier = calcAgeMultiplier(age);

  return FIXED_RATE * tripLength * ageMultiplier;
};

// Retrieve the length of the trip in days
const calcTripLength = (start_date: string, end_date: string) => {
  const start = new Date(start_date);
  const end = new Date(end_date);
  const diff = end.getTime() - start.getTime();

  // Diff needs to be inclusive, so we need to add 1 to the result
  const days = (diff / (1000 * 3600 * 24)) + 1;

  return days;
};

const calcAgeMultiplier = (age: number) => {
  // Not sure if this should be 0 or infinity
  // can you insure people under 18? :thinking:
  if (age < 18) {
    return 0;
  } else if (age < 31) {
    return AGE_LOAD_TIERS[0];
  } else if (age < 41) {
    return AGE_LOAD_TIERS[1];
  } else if (age < 51) {
    return AGE_LOAD_TIERS[2];
  } else if (age < 61) {
    return AGE_LOAD_TIERS[3];
  } else {
    // Similarly, not sure if insuring over 70 is handled different?
    // Prompt specifies 61-70 but not > 70
    return AGE_LOAD_TIERS[4];
  }
};

export { validateDates, validateAge, calcTotal };
