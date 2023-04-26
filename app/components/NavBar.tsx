import Link from "next/link";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

export default function NavBar() {
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        <div className="flex">
          <SignInModal />
          <SignUpModal />
        </div>
      </div>
    </nav>
  );
}
