import axios from "axios";
import useSWR from "swr";
import PersonalizedGreeting from "./PersonalizedGreeting";
import Forms from "./Forms";

import "../index.css";

const Welcome = () => {
  const baseUrl = import.meta.env.PROD
    ? "https://hackerstheapi.com"
    : "http://localhost:3000";

  console.log("production env?: ", import.meta.env.PROD);

  const fetcher = async (url: string) =>
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => res.data);

  const { data, isLoading } = useSWR(`${baseUrl}/auth/check-auth`, fetcher);

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
    <PersonalizedGreeting username={username} accessToken={accessToken} />
  ) : (
    <Forms />
  );
};

export default Welcome;
