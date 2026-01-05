'use client';

import { useRouter, usePathname } from "next/navigation";
import "../styles/Navbar.css";
import { signOut, useSession } from "next-auth/react";


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isHomePage = pathname === "/home";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const goHome = () => {
    if (isHomePage) {
      handleLogout();
    } else {
      router.push("/");
    }
  };

  const handleAuthClick = () => {
    if (isHomePage) {
      handleLogout();
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="navbar">
      <button className="authButton" onClick={goHome}>
        {isHomePage
          ? session?.user
            ? `📚 Welcome to TheSpot, ${session.user.email}!`
            : `📚 Welcome to TheSpot, Guest!`
          : `📚 Welcome to TheSpot!`
        }
      </button>

      <button className="authButton" onClick={handleAuthClick}>
        {isHomePage ? "Logout" : "Login"}
      </button>
    </nav>
  );
}
