import * as yup from "yup";

// Phone login schemas
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

// Email login schemas
export const emailLoginSchema = yup.object({
  email: yup.string().email("email_invalid").required("email_required"),
  password: yup.string().required("password_required"),
});



