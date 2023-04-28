"use client";
import { useContext, useEffect, useState } from "react";
import SignModal from "./SignModal";
import { useAuth } from "hooks/useAuth";
import { AuthenicationContext } from "@/context/AuthContext";
import LoadingIcon from "./icons/LoadingIcon";
import { Alert, AlertDescription, AlertTitle } from "@@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface InputsType {
  email: string;
  password: string;
}

export default function SignInModal() {
  let [isOpen, setIsOpen] = useState(false);
  let [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    for (const key in inputs) {
      const value = inputs[key as keyof InputsType];
      if (!value) {
        return setDisabled(true);
      }
    }
    setDisabled(false);
  }, [inputs]);

  const { signin } = useAuth();

  const handleClick = async () => {
    await signin({ ...inputs });
  };

  const { loading, error } = useContext(AuthenicationContext);

  return (
    <>
      <button
        className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
        type="button"
        onClick={openModal}
      >
        Sign in
      </button>

      <SignModal title="Sign In" isOpen={isOpen} onClose={closeModal}>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingIcon className={`mr-4 ${loading ? "animate-spin" : ""}`} />
            Loading...
          </div>
        ) : (
          <>
            <div className="mt-2">
              <p className="text-sm font-light text-gray-500 text-center">
                Log Into your account
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Email"
                className="px-2 py-3 border rounded col-span-2"
                value={inputs.email}
                onChange={(e) => {
                  setInputs({ ...inputs, email: e.target.value });
                }}
              />
              <input
                type="password"
                placeholder="Password"
                className="px-2 py-3 border rounded col-span-2"
                value={inputs.password}
                onChange={(e) => {
                  setInputs({ ...inputs, password: e.target.value });
                }}
              />
            </div>
            {error ? (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validate failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="mt-4">
              <button
                className="uppercase bg-red-500 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={disabled}
                onClick={handleClick}
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </SignModal>
    </>
  );
}
