import axios from "axios";
import useSWR from "swr";
import WarmWelcome from "./WarmWelcome";
import Forms from "./Forms";

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
    return <p>Loading...</p>;
  }

  const username = data?.username;
  const accessToken = data?.accessToken;

  return username && accessToken ? (
    <WarmWelcome username={username} token={accessToken} />
  ) : (
    <Forms />
  );
};

export default Welcome;
