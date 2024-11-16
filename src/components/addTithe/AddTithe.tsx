import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  orderBy,
  query,
  getDocs,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddTithe() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [member, setMember] = useState("None");
  const [error, setError] = useState("");

  const [memberDropdown, setMemberDropdown] = useState<any>(null);

  async function getMemberDropdown() {
    const memberRef = collection(db, "members");
    const memberRefQuery = query(memberRef, orderBy("lastName", "asc"));
    const snapshots = await getDocs(memberRefQuery).then((snapshots) => {
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      console.log(docs);
      setMemberDropdown(docs);
    });
  }

  useEffect(() => {
    getMemberDropdown();
  }, []);

  function uploadActivity() {
    try {
      const activityRef = collection(db, "activity");
      const owner: string | null = localStorage.getItem("userEmail");
      var date = new Date();
      var options: any = { hour: "numeric", minute: "2-digit" };
      let currTime = date.toLocaleTimeString("en-US", options);
      let activity = "Add";
      addDoc(activityRef, {
        resource: "Tithe",
        activity: activity,
        owner: owner,
        date: new Date(),
        time: currTime,
      })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          setError("Something went wrong");
        });
    } catch (error) {
      setError("Something went wrong");
    }
  }

  function submitHandler(e: any) {
    e.preventDefault();
    let data = {
      date: date,
      amount: parseInt(amount),
      member: member,
      dateAdded: new Date(),
    };

    console.log(data);

    const dbRef = collection(db, "tithe");
    try {
      addDoc(dbRef, data)
        .then((res) => {
          console.log(res);
          // window.location.reload();
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
      {memberDropdown ? (
        <>
          <label className="m-1">Date</label>
          <input
            className="border w-40 p-2 m-1 rounded"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="flex flex-col space-y-2">
            <label className="select-label">Select Member</label>
            <div className="select-container">
              <select
                className="select-field"
                name="member"
                value={member}
                onChange={(e) => setMember(e.target.value)}
                required
              >
                <option value="None">Select a member</option>
                {memberDropdown &&
                  memberDropdown.map((member: any) => (
                    <option key={member.id} value={member.lastName}>
                      {member.lastName} {member.otherNames}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <label className="m-1">Amount</label>
          <input
            className="border w-40 p-2 m-1 rounded"
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
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
            Add Tithe
          </button>
        </>
      ) : (
        <div>
          <span>Loading form...</span>
        </div>
      )}
    </form>
  );
}
