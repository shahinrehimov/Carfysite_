import * as yup from "yup";

// Phone registration schemas
export const phoneSchema = yup.object({
  phone: yup
    .string()
    .matches(/^994\d{9}$/, "phone_format_error")
    .required("phone_required"),
});

export const otpSchema = yup.object({
  otp: yup
    .string()
    .matches(/^\d{4}$/, "otp_format_error")
    .required("otp_required"),
});

export const phoneRegisterSchema = yup.object({
  name: yup.string().required("name_required"),
  surname: yup.string().required("surname_required"),
  email: yup.string().email("email_invalid").required("email_required"),
});

// Email registration schemas
export const emailCheckSchema = yup.object({
  email: yup.string().email("email_invalid").required("email_required"),
});

export const emailRegisterSchema = yup.object({
  name: yup.string().required("name_required"),
  surname: yup.string().required("surname_required"),
  phone: yup
    .string()
    .matches(/^994\d{9}$/, "phone_format_error")
    .required("phone_required"),
  password: yup
    .string()
    .min(8, "password_min_length")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "password_format_error"
    )
    .required("password_required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "password_not_match")
    .required("password_confirmation_required"),
  gender: yup.string().nullable(),
  birth_date: yup.string().nullable(),
});
