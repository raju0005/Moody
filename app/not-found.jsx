import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-custom uppercase text-gradient-xl mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Oops! the page you&apos;re looking for does&apos;t exist or has been
        moved.
      </p>
      <Link href="/">
        <Button variant="journal">Return home</Button>
      </Link>
    </div>
  );
};
export default NotFound;
