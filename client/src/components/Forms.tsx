import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import "../index.css";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import WarmWelcome from "./WarmWelcome";

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
