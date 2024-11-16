import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ViewContribution(props: any) {
  console.log(props);

  const [contributions, setContributions] = useState<any>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function filterContributions() {
      let data: any = [];
      props.data.datesAdded.forEach((item: any) => {
        if (props.data.monthYear == item.monthYear) {
          data.push(item);
        }
      });
      console.log(data);
      setContributions(data);
    }
    filterContributions();
  }, []);

  function uploadActivity() {
    try {
      const activityRef = collection(db, "activity");
      const owner: string | null = localStorage.getItem("userEmail");
      var date = new Date();
      var options: any = { hour: "numeric", minute: "2-digit" };
      let currTime = date.toLocaleTimeString("en-US", options);
      let activity = "Delete";
      addDoc(activityRef, {
        resource: "Project",
        activity: activity,
        owner: owner,
        date: new Date(),
        time: currTime,
      })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          setDeleteError("Could not delete");
        });
    } catch (error) {
      setDeleteError("Could not delete");
    }
  }

  function deleteHandler(id: string) {
    const docRef = doc(db, "contribution", id);
    deleteDoc(docRef)
      .then(() => {
        console.log("deleted");
        // window.location.reload();
        uploadActivity();
      })
      .catch((err) => {
        console.log(err);
        setDeleteError("Could not delete");
      });
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row justify-between flex-wrap space-x-10 my-5">
        <span className="font-bold">{`Month -  ${props.data.monthYear}`}</span>
        <span className="font-bold">{`Total Amount - GHS ${props.data.totalContributions}`}</span>
      </div>

      {deleteError && (
        <div
          className={`text-center text-sm font-regular text-white bg-red-400 border p-1 rounded`}
        >
          <span>{deleteError}</span>
        </div>
      )}

      <table className="border-separate table-auto border-spacing-y-[10px] text-[15px] w-[100%] flex-wrap text-sm">
        <thead>
          <tr className="text-left">
            <th>Date</th>
            <th>Amount</th>
            {/* <th>Time</th> */}
            <th></th>
          </tr>
        </thead>

        {contributions ? (
          <tbody>
            {contributions.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-300">
                <td>{item.date}</td>
                <td>{item.amount}</td>
                {/* <td>{item.amount}</td> */}
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    color="red"
                    onClick={() => deleteHandler(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <span>Loading contributions</span>
        )}
      </table>
    </div>
  );
}
