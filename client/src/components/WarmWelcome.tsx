import { useState } from "react";

const WarmWelcome = ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => {
  const [showToken, setShowToken] = useState(false);

  const toggleShowToken = () => {
    setShowToken(!showToken);
  };

  return (
    <div>
      <p>Hi, {username}!</p>
      <div>
        <label htmlFor="accessToken">Access Token</label>
        {showToken ? (
          <input id="accessToken" type="text" value={token} disabled />
        ) : (
          <input id="accessToken" type="password" value={token} disabled />
        )}
        <button onClick={toggleShowToken}>Show</button>
      </div>
    </div>
  );
};

export default WarmWelcome;
