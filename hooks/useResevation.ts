import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function useResevation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const createResevation = async ({
    slug,
    partySize,
    day,
    time,
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    bookerEmail: string;
    bookerPhone: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerOccasion?: string;
    bookerRequest?: string;
  }) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/restaurant/${slug}/reserve`,
        {
          bookerEmail,
          bookerPhone,
          bookerFirstName,
          bookerLastName,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: {
            partySize,
            day,
            time,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      let errorMessage: string = "";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data.errorMessage;
      } else {
        errorMessage = (error as Error).message;
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    loading,
    error,
    createResevation,
  };
}
