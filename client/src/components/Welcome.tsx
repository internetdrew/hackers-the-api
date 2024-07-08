import axios from "axios";
import useSWR from "swr";
import PersonalizedGreeting from "./PersonalizedGreeting";
import Forms from "./Forms";

import "../index.css";

const Welcome = () => {
  const fetcher = (url: string) =>
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => res.data);

  const { data, isLoading } = useSWR(
    "http://localhost:3000/check-auth",
    fetcher,
  );

  if (isLoading) {
    return (
      <p className="loading">
        <strong>Loading...</strong>
      </p>
    );
  }

  const username = data?.username;
  const accessToken = data?.accessToken;

  return username && accessToken ? (
    <PersonalizedGreeting username={username} token={accessToken} />
  ) : (
    <Forms />
  );
};

export default Welcome;
