import * as Yup from "yup";

const signUpSchema = Yup.object({
  fname: Yup.string()
    .required("First Name is required")
    .min(5, "Must be at least 5 characters"),
  lname: Yup.string()
    .required("Last Name is required")
    .min(5, "Must be at least 5 characters"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^\d{10}$/, "Must be 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
      "Password must contain 8 letters including 1 Number, 1 Upper & lower case and 1 special character."
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
export default signUpSchema;
