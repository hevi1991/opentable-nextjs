import axios, { AxiosError } from "axios";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState(null);

  const fetchAvailabilites = async ({
    slug,
    partySize,
    day,
    time,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
  }) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/restaurant/${slug}/availability`,
        {
          params: { partySize, day, time },
        }
      );
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);

      let errorMessage: string = "";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data.errorMessage;
      } else {
        errorMessage = (error as Error).message;
      }
      setError(errorMessage);
    }
  };

  return { loading, data, error, fetchAvailabilites };
};
