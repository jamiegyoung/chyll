import { useEffect, useState } from "react";

const useFetch = (url, options) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, options).then((res) => res.json());
        setResponse(res);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [options, url]);
  return { response, error };
};

export default useFetch;
