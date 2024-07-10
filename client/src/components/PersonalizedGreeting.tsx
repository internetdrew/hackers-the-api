import toast from "react-hot-toast";
import { RiHandCoinLine } from "react-icons/ri";
import { LuCopy } from "react-icons/lu";

import "../index.css";

const PersonalizedGreeting = ({
  username,
  accessToken,
}: {
  username: string;
  accessToken: string;
}) => {
  const copyAccessToken = () => {
    navigator.clipboard
      .writeText(accessToken)
      .then(() => {
        toast.success("Access token copied to clipboard!");
      })
      .catch((_err) => {
        toast.error("Failed to copy access token.");
      });
  };

  return (
    <div className="personalized-welcome">
      <p className="greeting">
        <strong>
          Welcome, <span className="username">{username}</span>
        </strong>
        !
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
            value={accessToken}
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
