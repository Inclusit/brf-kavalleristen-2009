import { UserLoginData, UserRegistrationData } from "../../../types/user";

//Validate user registration
export function UserRegistrationValidator(
  data: UserRegistrationData
): [boolean, ErrorObject] {
  let errors: ErrorObject = {};

  if (!data.email) {
    errors.email = "Email krävs";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email ej giltig";
  }

  if (!data.password) {
    errors.password = "Password krävs";
  } else if (data.password.length < 6) {
    errors.password = "Password måste vara minst 6 tecken";
  }
  

  const hasErrors = Object.keys(errors).length > 0;

  return [hasErrors, errors];
}

//Validate user login
export function userLoginValidator(
  data: UserLoginData
): [boolean, ErrorObject] {
  let errors: ErrorObject = {};

  if (!data.email) {
    errors.email = "Email krävs";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email ej giltig";
  }

  if (!data.password) {
    errors.password = "Password krävs";
  }

  const hasErrors = Object.keys(errors).length > 0;

  return [hasErrors, errors];
}

