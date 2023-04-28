"use client";

import Link from "next/link";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { useContext } from "react";
import { AuthenicationContext } from "@/context/AuthContext";

export default function NavBar() {
  const { data, loading } = useContext(AuthenicationContext);

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        <div className="flex">
          {/* {loading ? null : data ? (
            <span>TODO: signout</span>
          ) : (
            <>
              <SignInModal />
              <SignUpModal />
            </>
          )} */}
          <>
            <SignInModal />
            <SignUpModal />
          </>
        </div>
      </div>
    </nav>
  );
}
