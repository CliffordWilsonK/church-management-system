import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddSeed() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState("");

  const [error, setError] = useState("");

  function uploadActivity() {
    try {
      const activityRef = collection(db, "activity");
      const owner: string | null = localStorage.getItem("userEmail");
      var date = new Date();
      var options: any = { hour: "numeric", minute: "2-digit" };
      let currTime = date.toLocaleTimeString("en-US", options);
      let activity = "Add";
      addDoc(activityRef, {
        resource: "Seed",
        activity: activity,
        owner: owner,
        date: new Date(),
        time: currTime,
      })
        .then(() => {
          setError("");
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          setError("Something went wrong");
        });
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  }

  function submitHandler(e: any) {
    e.preventDefault();
    console.log(date);
    console.log(amount);
    console.log(members);
    const data = {
      date: date,
      amount: parseInt(amount),
      members: parseInt(members),
      dateAdded: new Date(),
    };
    const dbRef = collection(db, "seed");
    try {
      addDoc(dbRef, data)
        .then((res) => {
          console.log(res);
          uploadActivity();
        })
        .catch((err) => {
          console.log(err);
          setError("Something went wrong");
        });
    } catch (e) {
      console.log(e);
      setError("Something went wrong");
    }
  }

  return (
    <form
      className="flex flex-col m-10 border-y-spacing-4"
      onSubmit={submitHandler}
    >
      <label className="m-1">Date</label>
      <input
        className="border w-40 p-2 m-1 rounded"
        type="date"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <label className="m-1">Amount</label>
      <input
        className="border w-40 p-2 m-1 rounded"
        type="number"
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <label className="m-1">Number of Members</label>
      <input
        className="border m-1 mb-4 w-40 p-2 rounded"
        type="number"
        name="members"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
      />
      {error && (
        <div
          className={`text-center text-white bg-red-400 border p-2 rounded mb-2`}
        >
          <span>{error && error}</span>
        </div>
      )}
      <button
        className="text-white m-1 p-2 h-10 rounded w-40 bg-[#8B7E74]"
        type="submit"
      >
        Add Seed
      </button>
    </form>
  );
}
