"use client";

import { Montserrat } from "@next/font/google";
import Image from "next/image";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { useContext } from "react";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  // const {user} = useAuth()
  // console.log('logging context', user)

  function signIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.user.uid));
        localStorage.setItem("userEmail", email);
        router.push("/main/dashboard");
      })
      .catch((err) => {
        console.log(err);
        setError("Wrong username or password");
      });
  }

  function submitHandler(e: any) {
    e.preventDefault();
    console.log(email);
    console.log(password);
    signIn();
  }

  return (
    <div
      className={`${montserrat.variable} font-sans flex bg-white rounded-lg flex-col p-10 min-w-[30%] flex-wrap`}
    >
      <div className="flex flex-col items-center">
        <Image
          className="m-5"
          src="/images/logo.png"
          alt="logo"
          width={75}
          height={76}
        />
        <div className="text-center flex flex-col">
          <span className="font-bold my-2">WELCOME</span>
          <span className="text-[#9FA2B4] text-sm mb-8">
            Enter your email and password below
          </span>
        </div>
      </div>

      <form className="flex flex-col" onSubmit={submitHandler}>
        <span className="text-[#9FA2B4] my-2 text-sm">EMAIL</span>
        <input
          placeholder="Email address"
          className="border-2 rounded-lg p-2 mb-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <div className="flex flex-row justify-between my-2">
          <span className="text-[#9FA2B4] text-sm">PASSWORD</span>
          {/* <span className="text-[#9FA2B4] text-sm">Forgot password?</span> */}
        </div>
        <input
          placeholder="Password"
          className="border-2 rounded-lg p-2 mb-10"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div
            className={`text-center text-white bg-red-400 border p-2 rounded mb-2`}
          >
            <span>{error}</span>
          </div>
        )}
        <button className="bg-[#3751ff] rounded-lg h-[10%] p-3" type="submit">
          <span className="text-white">Log In</span>
        </button>
      </form>
    </div>
  );
}
