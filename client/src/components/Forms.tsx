import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import "../index.css";

const Forms = () => {
  const [activeForm, setActiveForm] = useState<"register" | "login">(
    "register",
  );

  return (
    <div className="forms-container">
      {activeForm === "register" ? (
        <RegisterForm setActiveForm={setActiveForm} />
      ) : (
        <LoginForm setActiveForm={setActiveForm} />
      )}
    </div>
  );
};

export default Forms;
