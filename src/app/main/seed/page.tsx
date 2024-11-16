"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddSeed from "@/components/addSeed/AddSeed";

import {
  collection,
  deleteDoc,
  doc,
  addDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import ExportData from "@/components/exportData/ExportData";
import { Montserrat } from "@next/font/google";
import { LoadingTable } from "@/components/loading/Loading";
import { LoadingValue } from "@/components/loading/Loading";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Seed() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [seedData, setSeedData] = useState<any>(null);
  const [deleteError, setDeleteError] = useState("");

  let [exportData, setExportData] = useState<any>(null);

  let [deleteModal, setDeleteModal] = useState(false);
  let [deleteID, setDeleteID] = useState("");

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  function openDeleteModal(id: string) {
    setDeleteID(id);
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteID("");
    setDeleteModal(false);
  }

  useEffect(() => {
    const fetchSeedData = async () => {
      setIsLoading(true);
      try {
        let exportDataTmp = [["Date", "Amount", "Members"]];
        const seedRef = collection(db, "seed");
        const seedRefQuery = query(seedRef, orderBy("dateAdded", "desc"));
        const snapshots = await getDocs(seedRefQuery);
        
        const docs = snapshots.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          exportDataTmp.push([data.date, data.amount, data.members]);
          return data;
        });

        // Calculate totals
        const total = docs.reduce((sum, doc) => sum + (doc.amount || 0), 0);
        const now = new Date();
        const monthlyTotal = docs.reduce((sum, doc) => {
          const docDate = new Date(doc.date);
          if (docDate.getMonth() === now.getMonth() && 
              docDate.getFullYear() === now.getFullYear()) {
            return sum + (doc.amount || 0);
          }
          return sum;
        }, 0);
        const totalMembers = docs.reduce((sum, doc) => sum + (Number(doc.members) || 0), 0);

        setSeedData(docs);
        setExportData(exportDataTmp);
      } catch (error) {
        console.error("Error fetching seed data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeedData();
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
        resource: "Seed",
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
    const docRef = doc(db, "seed", deleteID);
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

  // Update summary data calculation
  const summaryData = [
    {
      title: "Total Seeds",
      figure: isLoading ? <LoadingValue /> : 
        seedData ? `GHS ${seedData.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0}` : "No data",
    },
    {
      title: "This Month",
      figure: isLoading ? <LoadingValue /> :
        seedData ? `GHS ${seedData.filter((item: any) => {
          const itemDate = new Date(item.date);
          const now = new Date();
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear();
        }).reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0}` : "No data",
    },
    {
      title: "Last Service",
      figure: isLoading ? <LoadingValue /> :
        seedData && seedData.length > 0 ? `GHS ${seedData[0]?.amount || 0}` : "GHS 0",
    },
    {
      title: "Total Members",
      figure: isLoading ? <LoadingValue /> :
        seedData ? seedData.reduce((acc: number, curr: any) => acc + Number(curr.members), 0) || 0 : "No data",
    },
  ];

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Seed Management</h2>
        <div className="flex gap-4">
          <button
            className="btn-primary"
            onClick={() => setIsOpen(true)}
          >
            Add Seed
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
                <th className="table-cell">Members</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={4}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            ) : seedData && seedData.length > 0 ? (
              <tbody>
                {seedData.map((data: any) => (
                  <tr key={data.id} className="table-row">
                    <td className="table-cell">{data.date}</td>
                    <td className="table-cell">GHS {data.amount}</td>
                    <td className="table-cell">{data.members}</td>
                    <td className="table-cell">
                      <button
                        onClick={() => openDeleteModal(data.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        title="Delete seed record"
                        aria-label="Delete seed record"
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
                  <td colSpan={4} className="table-cell text-center text-gray-500">
                    No seed records found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Add Seed Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Add New Seed
                  </Dialog.Title>
                  <AddSeed />
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
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Delete Seed Record
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this seed record? This action cannot be undone.
                    </p>
                  </div>

                  {deleteError && (
                    <div className="mt-2">
                      <p className="text-sm text-red-500">{deleteError}</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
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
