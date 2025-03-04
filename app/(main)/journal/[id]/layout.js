import Link from "next/link";
import { Suspense } from "react";
import BarLoader from "react-spinners/BarLoader";

const EntryLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="">
        <Link
          href="/dashboard"
          className="text-md font-bold text-amber-600 hover:text-blue-700 cursor-pointer"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <Suspense fallback={<BarLoader color="blue" width={"100%"} />}>
        {children}
      </Suspense>
    </div>
  );
};
export default EntryLayout;
