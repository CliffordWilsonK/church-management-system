"use client";

import NavBar from "@/components/navbar/NavBar";
import { Montserrat } from '@next/font/google';
import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: 'swap',
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setIsUserValid(true);
          console.log("This is the logged in user", user);
        } else {
          console.log("no user found");
          router.push("/");
        }
      });
    };

    checkAuth();
  }, []);

  if (isUserValid) {
    return (
      <div className={`${montserrat.variable} font-sans min-h-screen bg-gray-50`}>
        <NavBar />
        <main className="pt-20">{children}</main>
      </div>
    );
  }
}
