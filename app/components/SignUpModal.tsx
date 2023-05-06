"use client";

import { useContext, useEffect, useState } from "react";
import SignModal from "./SignModal";
import { useAuth } from "@@/hooks/useAuth";
import { AuthenicationContext } from "../context/AuthContext";
import LoadingIcon from "./icons/LoadingIcon";
import { Alert, AlertDescription, AlertTitle } from "@@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface InputsType {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  email: string;
  password: string;
}

export default function SignUpModal() {
  let [isOpen, setIsOpen] = useState(false);
  let [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
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

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const { signup } = useAuth();

  const handleClick = async () => {
    try {
      await signup({ ...inputs });
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  
  const { loading, error } = useContext(AuthenicationContext);

  return (
    <>
      <button
        className="border p-1 px-4 rounded"
        type="button"
        onClick={openModal}
      >
        Sign up
      </button>

      <SignModal title="Create Account" isOpen={isOpen} onClose={closeModal}>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingIcon className="mr-4" />
            Loading...
          </div>
        ) : (
          <>
            <div className="mt-2">
              <p className="text-sm font-light text-gray-500 text-center">
                Create your opentable account
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="First Name"
                className="px-2 py-3 border rounded"
                value={inputs.firstName}
                name="firstName"
                onChange={handleChangeInputs}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-2 py-3 border rounded"
                value={inputs.lastName}
                name="lastName"
                onChange={handleChangeInputs}
              />
              <input
                type="text"
                placeholder="Email"
                className="px-2 py-3 border rounded col-span-2"
                value={inputs.email}
                name="email"
                onChange={handleChangeInputs}
              />
              <input
                type="text"
                placeholder="Phone"
                className="px-2 py-3 border rounded"
                value={inputs.phone}
                name="phone"
                onChange={handleChangeInputs}
              />
              <input
                type="text"
                placeholder="City"
                className="px-2 py-3 border rounded"
                value={inputs.city}
                name="city"
                onChange={handleChangeInputs}
              />
              <input
                type="password"
                placeholder="Password"
                className="px-2 py-3 border rounded col-span-2"
                value={inputs.password}
                name="password"
                onChange={handleChangeInputs}
              />
            </div>
            <div className="mt-4">
              <button
                className="uppercase bg-red-500 w-full text-white p-3 rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={disabled}
                onClick={handleClick}
              >
                Create Account
              </button>
            </div>
            {error ? (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validate failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </>
        )}
      </SignModal>
    </>
  );
}
