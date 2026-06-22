import * as yup from "yup";

export const resetPasswordSchema = yup.object({
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
});
