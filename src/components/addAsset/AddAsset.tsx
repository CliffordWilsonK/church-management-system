import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddAsset() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [tagNo, setTagNo] = useState("");
  const [location, setLocation] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

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
        resource: "Asset",
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
    const data = {
      name: name,
      type: type,
      model: model,
      serialNo: serialNo,
      tagNo: tagNo,
      location: location,
      purchaseDate: purchaseDate,
      dateAdded: new Date(),
    };
    const dbRef = collection(db, "asset");
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
    <form className="flex flex-col m-2" onSubmit={submitHandler}>
      <label className="m-1">Name</label>
      <input
        className="border p-2 mb-3 rounded"
        type="text"
        name="date"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className="m-1">Type</label>
      <input
        className="border p-2 mb-3 rounded"
        type="text"
        name="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />
      <label className="m-1">Model</label>
      <input
        className="border p-2 mb-3 rounded"
        type="text"
        name="model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <label className="m-1">Serial Number</label>
      <input
        className="border p-2 mb-3 rounded"
        type="text"
        name="serailNo"
        value={serialNo}
        onChange={(e) => setSerialNo(e.target.value)}
        required
      />
      <label className="m-1">Tag Number</label>
      <input
        className="border p-2 mb-3 rounded"
        type="text"
        name="tagNo"
        value={tagNo}
        onChange={(e) => setTagNo(e.target.value)}
        required
      />
      <label className="m-1">Location</label>
      <input
        className="border p-2 mb-3 rounded"
        type="text"
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <label className="m-1">Date of Purchase</label>
      <input
        className="border p-2 mb-3 rounded"
        type="date"
        name="purchaseDate"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
        required
      />
      {error && (
        <div
          className={`text-center text-white bg-red-400 border p-2 rounded mb-2`}
        >
          <span>{error}</span>
        </div>
      )}
      <button
        className="text-white m-1 p-2 h-10 rounded w-40 bg-[#8B7E74]"
        type="submit"
      >
        Add Contribution
      </button>
    </form>
  );
}
