"use client";

import { useEffect, useState } from "react";

import { Montserrat } from "@next/font/google";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ExportData from "@/components/exportData/ExportData";
import { LoadingTable } from "@/components/loading/Loading";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Activity() {
  const [activityData, setActivityData] = useState<any>(null);
  let [exportData, setExportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let exportDataTmp = [["Resource", "Activity", "Owner", "Date", "Time"]];
        const activityRef = collection(db, "activity");
        const activityRefQuery = query(activityRef, orderBy("date", "desc"));
        
        const snapshots = await getDocs(activityRefQuery);
        const docs = snapshots.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          
          // Only add to exportData if the document has all required fields
          if (data.resource && data.activity && data.owner && data.date && data.time) {
            exportDataTmp.push([
              data.resource,
              data.activity,
              data.owner,
              data.date,
              data.time,
            ]);
          }
          return data;
        });

        setActivityData(docs);
        
        // Only set exportData if we have documents
        if (docs.length > 0) {
          setExportData(exportDataTmp);
          console.log("Activity data loaded:", docs);
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <span className="section-title">Activity Log</span>
      <hr className="mt-5" />
      <div className="mt-8 content-card">
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Resource</th>
                <th className="table-cell">Activity</th>
                <th className="table-cell">Owner</th>
                <th className="table-cell">Date</th>
                <th className="table-cell">Time</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            ) : activityData && activityData.length > 0 ? (
              <tbody>
                {activityData.map((data: any) => (
                  <tr key={data.id} className="table-row">
                    <td className="table-cell">{data.resource}</td>
                    <td className="table-cell">{data.activity}</td>
                    <td className="table-cell">{data.owner}</td>
                    <td className="table-cell">{data.date?.toDate().toDateString() || 'N/A'}</td>
                    <td className="table-cell">{data.time || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={5} className="table-cell text-center text-gray-500">
                    No activities found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
