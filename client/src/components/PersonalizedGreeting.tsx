import { useState } from "react";
import { RiHandCoinLine } from "react-icons/ri";
import { LuCopy } from "react-icons/lu";

import "../index.css";
import toast from "react-hot-toast";

const PersonalizedGreeting = ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => {
  const copyAccessToken = () => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        toast.success("Access token copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy access token.");
      });
  };

  return (
    <div className="personalized-welcome">
      <p className="greeting">
        Welcome, <strong className="username">{username}</strong>!
      </p>
      <div className="input-control">
        <label id="token-label" htmlFor="accessToken">
          <strong>Access token</strong>
        </label>
        <div className="token-input-container">
          <RiHandCoinLine />
          <input
            id="accessToken"
            className="token-display"
            type="password"
            value={token}
            disabled
          />
          <button onClick={copyAccessToken}>
            <LuCopy />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedGreeting;
