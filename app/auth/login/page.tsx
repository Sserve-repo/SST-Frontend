import React from "react";
import LoginForm from "./_components/LoginForm";

const RegisterPage = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full min-h-screen flex-col">
        <div className="container mx-auto p-4 justify-center w-full items-center flex flex-col">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
