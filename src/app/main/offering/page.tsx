"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddOffering from "@/components/addOffering/AddOffering";

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
import { LoadingValue, LoadingTable } from "@/components/loading/Loading";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Offering() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [offeringData, setOfferingData] = useState<any>(null);
  const [totalOffering, setTotalOffering] = useState(0);
  const [monthlyOffering, setMonthlyOffering] = useState(0);
  const [lastServiceOffering, setLastServiceOffering] = useState(0);
  const [averageOffering, setAverageOffering] = useState(0);

  const [deleteError, setDeleteError] = useState("");

  let [exportData, setExportData] = useState<any>(null);

  // Delete Modal
  let [deleteModal, setDeleteModal] = useState(false);
  let [deleteID, setDeleteID] = useState("");

  function openDeleteModal(id: string) {
    setDeleteID(id);
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteID("");
    setDeleteModal(false);
  }

  const [isLoading, setIsLoading] = useState(true);

  // Update summaryData with loading states
  const summaryData = [
    {
      title: "Total Offering",
      figure: isLoading ? <LoadingValue /> : 
        offeringData ? `GHS ${totalOffering}` : "No data",
    },
    {
      title: "This Month",
      figure: isLoading ? <LoadingValue /> :
        offeringData ? `GHS ${monthlyOffering}` : "No data",
    },
    {
      title: "Last Service",
      figure: isLoading ? <LoadingValue /> :
        offeringData ? `GHS ${lastServiceOffering}` : "No data",
    },
    {
      title: "Average per Service",
      figure: isLoading ? <LoadingValue /> :
        offeringData ? `GHS ${averageOffering}` : "No data",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchOfferingData = async () => {
          let exportDataTmp = [["Date", "Amount", "Members"]];
          const offeringRef = collection(db, "offering");
          const offeringRefQuery = query(offeringRef, orderBy("date", "desc"));
          const snapshots = await getDocs(offeringRefQuery);
          
          const docs = snapshots.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            exportDataTmp.push([data.date, data.amount, data.members]);
            return data;
          });

          // Calculate totals
          let total = 0;
          let monthlyTotal = 0;
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          docs.forEach((doc) => {
            const offeringDate = new Date(doc.date);
            total += doc.amount;

            if (offeringDate.getMonth() === currentMonth && 
                offeringDate.getFullYear() === currentYear) {
              monthlyTotal += doc.amount;
            }
          });

          setOfferingData(docs);
          setTotalOffering(total);
          setMonthlyOffering(monthlyTotal);
          setLastServiceOffering(docs[0]?.amount || 0);
          setAverageOffering(docs.length > 0 ? Math.round(total / docs.length) : 0);
          setExportData(exportDataTmp);
        };

        await fetchOfferingData();
      } catch (error) {
        console.error("Error fetching offering data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
        resource: "Offering",
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

  function deleteHandler() {
    const docRef = doc(db, "offering", deleteID);
    deleteDoc(docRef)
      .then(() => {
        console.log("deleted");
        // setDeleteError('')
        // window.location.reload();
        uploadActivity();
      })
      .catch((err) => {
        console.log(err);
        setDeleteError("Could not delete");
      });
  }

  // Add modal state and functions
  let [isAddOfferingOpen, setIsAddOfferingOpen] = useState(false);

  function closeAddOfferingModal() {
    setIsAddOfferingOpen(false);
  }

  function openAddOfferingModal() {
    setIsAddOfferingOpen(true);
  }

  // Change handleDelete to use existing deleteHandler
  function handleDelete(id: string) {
    setDeleteID(id);
    setDeleteModal(true);
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Offering Management</h2>
        <div className="flex gap-4">
          <button
            className="btn-primary"
            onClick={() => setIsAddOfferingOpen(true)}
          >
            Add Offering
          </button>
          {exportData && <ExportData data={exportData} />}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((content, index) => (
          <div key={index} className="content-card">
            <div className="flex flex-col">
              <span className="text-3xl font-semibold text-gray-800 mb-2">
                {content.figure}
              </span>
              <span className="text-sm text-gray-500 capitalize">
                {content.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="mt-8 content-card">
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Date</th>
                <th className="table-cell">Amount</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            ) : offeringData && offeringData.length > 0 ? (
              <tbody>
                {offeringData.map((data: any) => (
                  <tr key={data.id} className="table-row">
                    <td className="table-cell">{data.date}</td>
                    <td className="table-cell">GHS {data.amount}</td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleDelete(data.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        title="Delete offering record"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={3} className="table-cell text-center text-gray-500">
                    No offering records found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Add Offering Modal */}
      <Transition appear show={isAddOfferingOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeAddOfferingModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Offering
                  </Dialog.Title>
                  <AddOffering />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Offering
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this offering?
                    </p>
                  </div>

                  {deleteError && (
                    <div className="mt-2">
                      <p className="text-sm text-red-500">{deleteError}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={deleteHandler}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
