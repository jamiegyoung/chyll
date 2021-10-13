import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useCSRF = () => {
  const [csrfToken, setCSRFToken] = useState(null);

  useEffect(() => {
    setCSRFToken(Cookies.get("CSRF-Token"));
  }, []);

  return csrfToken;
};

export default useCSRF;