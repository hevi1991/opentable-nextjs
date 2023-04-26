"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function SignUpModal() {
  let [isOpen, setIsOpen] = useState(false);
  let [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <>
      <button
        className="border p-1 px-4 rounded"
        type="button"
        onClick={openModal}
      >
        Sign up
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md h-[600px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 text-gray-900 uppercase font-bold text-center pb-2 border-b mb-2"
                  >
                    Create Account
                  </Dialog.Title>
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
                    <button className="uppercase bg-red-500 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400">
                      Create Account
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
