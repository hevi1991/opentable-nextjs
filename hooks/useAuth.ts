import { useContext } from "react";
import axios, { AxiosError } from "axios";
import { AuthenicationContext } from "@/context/AuthContext";

export const useAuth = () => {
  const { setAuthState } = useContext(AuthenicationContext);

  const signin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setAuthState({ loading: true, data: null, error: null });
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });
      setAuthState({ loading: false, data: response.data, error: null });
    } catch (error: any) {
      let errorMessage: string = "";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data.errorMessage;
      } else {
        errorMessage = (error as Error).message;
      }
      setAuthState({
        loading: false,
        data: null,
        error: errorMessage,
      });
    }
  };

  const signup = async () => {};

  return {
    signin,
    signup,
  };
};
