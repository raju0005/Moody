import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { FolderOpen, PenBox } from "lucide-react";
import UserMenu from "./UserMenu";
import { checkUser } from "@/lib/checkuser";

const Header = async () => {
  await checkUser();
  return (
    <header className="container mx-auto">
      <nav className="py-2 px-4 flex justify-between items-center ">
        <Link href={"/"}>
          <Image
            src={`/logo2.png`}
            alt="Moody logo"
            className="md:h-32 h-20 w-auto object-contain"
            height={100}
            width={200}
          />
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard#collections">
              <Button variant="outline" className="flex items-center gap-2 font-bold text-md">
                <FolderOpen size={18} />
                <span className="hidden md:inline">Collections</span>
              </Button>
            </Link>
          </SignedIn>

          <Link href="/journal/write">
            <Button variant="journal" className="flex items-center gap-2 font-bold text-md">
              <PenBox size={18} />
              <span className="hidden md:inline">Write New</span>
            </Button>
          </Link>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button className='font-bold text-md' variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};
export default Header;
