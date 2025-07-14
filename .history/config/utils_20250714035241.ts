import { toast } from "sonner";

export const formatErrors = (errors, res) => {
  if (errors) {
    Object.keys(errors)?.forEach((field) => {
      errors[field].forEach((errorMessage) => {
        toast.error(res.message, {
          description: errorMessage,
        });
      });
    });
  }
};

export const getUserType = (user_type: string) => {
  return user_type == "3"
    ? "vendor"
    : user_type == "2"
    ? "buyer"
    : user_type == "4"
    ? "artisan"
    : "null";
};
