import { AuthenicationContext } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
import { useContext } from "react";
import { deleteCookie } from "cookies-next";

export const useAuth = () => {
  const { setAuthState } = useContext(AuthenicationContext);

  const signin = async (data: { email: string; password: string }) => {
    try {
      setAuthState({ loading: true, data: null, error: null });
      const response = await axios.post("/api/auth/signin", data);
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
      throw error;
    }
  };

  const signup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  }) => {
    try {
      setAuthState({ loading: true, data: null, error: null });
      const response = await axios.post("/api/auth/signup", data);
      setAuthState({ loading: false, data: response.data, error: null });
    } catch (error) {
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
      throw error;
    }
  };

  const signout = async () => {
    deleteCookie("jwt");
    setAuthState({ loading: false, data: null, error: null });
  };

  return {
    signin,
    signup,
    signout,
  };
};
