import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup.string().email("email_invalid").required("email_required"),
});
