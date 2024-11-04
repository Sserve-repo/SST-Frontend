import { toast } from "sonner";

export const formatErrors = (errors, res) => {
    Object.keys(errors)?.forEach((field) => {
        errors[field].forEach((errorMessage) => {
            toast.error(res.message, {
                description: errorMessage,
            });
        });
    });
}