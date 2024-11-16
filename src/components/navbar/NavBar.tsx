"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function NavBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const router = useRouter();

  function logout() {
    signOut(auth);
    localStorage.clear();
    router.push("/");
  }

  const navItems = [
    { name: "Dashboard", path: "/main/dashboard" },
    { name: "Members", path: "/main/members" },
    { name: "Offering", path: "/main/offering" },
    { name: "Seed", path: "/main/seed" },
    { name: "Tithe", path: "/main/tithe" },
    { name: "Project", path: "/main/project" },
    { name: "Asset", path: "/main/asset" },
    { name: "Activity", path: "/main/activity" },
  ];

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <nav className="flex flex-row px-6 w-full h-16 lg:items-center flex-wrap bg-white/90 backdrop-blur-md border-b border-gray-200 fixed top-0 z-50 shadow-sm">
      <div className="flex flex-row items-center lg:mr-40 md:mr-40">
        <FontAwesomeIcon
          className="md:hidden lg:hidden text-gray-600 hover:text-gray-800 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-all"
          onClick={handleClick}
          icon={faBars}
        />
        <Image
          className="m-4"
          src="/images/logo.png"
          alt="logo"
          width={30}
          height={30}
        />
        <span className="font-bold hidden lg:block md:block text-gray-800">
          CDC - Salvation Temple
        </span>
      </div>
      
      <div
        className={`${
          !active ? "" : "hidden"
        } w-full lg:w-auto md:w-auto order-last lg:order-none md:order-none flex-wrap flex flex-col md:flex-row items-center gap-1`}
      >
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`${
              pathname === item.path 
                ? "bg-blue-50 text-blue-600" 
                : "hover:bg-gray-50"
            } rounded-lg transition-all duration-200 ease-in-out`}
          >
            <Link 
              href={item.path} 
              className="px-4 py-2 block whitespace-nowrap"
            >
              <span 
                className={`${
                  pathname === item.path 
                    ? "text-blue-600 font-medium" 
                    : "text-gray-600 hover:text-gray-900"
                } text-sm`}
              >
                {item.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
      
      <div className="ml-auto flex items-center">
        <button 
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 ease-in-out flex items-center gap-2 shadow-sm"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
