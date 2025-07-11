import axios, { AxiosError } from "axios";

interface sendType {
  name: string;
  message: string;
}

const sendMessages = async ({ name, message }: sendType) => {
  const defaultNumber: string = "62895603792033";
  try {
    const response = await axios.post(
      "https://api.aliffajriadi.my.id/botwa/api/kirim",
      {
        nomor: defaultNumber,
        pesan: `by: ${name}\n\n${message}`,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Failed to send message"
      );
    }

    throw new Error("Failed to send message");
  }
};

export default sendMessages;
