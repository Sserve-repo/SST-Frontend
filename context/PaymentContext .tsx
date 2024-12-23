"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  ChangeEvent,
} from "react";

type FormDataType = {
  address: string;
  city: string;
  email: string;
  fullname: string;
  phone: string;
  postalCode: string;
  provinceId: string;
  dates: string;
  homeService: boolean;
  listingId: string;
};

interface PaymentContextType {
  setPaymentInfo: (form: FormDataType | null) => void;
  paymentInfo: () => FormDataType | null;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  formData: FormDataType;
}

const defaultFormData: FormDataType = {
  address: "",
  city: "",
  email: "",
  fullname: "",
  phone: "",
  postalCode: "",
  provinceId: "",
  dates: "",
  homeService: false,
  listingId: "",
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePaymentProvider = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentProvider must be used within an AuthProvider");
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormDataType>(defaultFormData);

  const setPaymentInfo = (form: FormDataType | null): void => {
    console.log("calling in context", form);
    setFormData(form || defaultFormData);
  };

  const paymentInfo = (): FormDataType | null => {
    return formData;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => {
        const updatedForm = {
          ...prev,
          [name]: value,
          homeService: checked,
        };
        localStorage.setItem("formData", JSON.stringify(updatedForm));
        return updatedForm;
      });
    } else {
      setFormData((prev) => {
        const updatedForm = {
          ...prev,
          [name]: value,
        };
        localStorage.setItem("formData", JSON.stringify(updatedForm));
        return updatedForm;
      });
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        paymentInfo,
        formData,
        setPaymentInfo,
        handleInputChange,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
