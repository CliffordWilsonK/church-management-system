"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddTithe from "@/components/addTithe/AddTithe";

import { Montserrat } from "@next/font/google";

import ExportData from "@/components/exportData/ExportData";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import { LoadingValue, LoadingTable } from "@/components/loading/Loading";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Tithe() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  let [exportData, setExportData] = useState<any>(null);

  const [titheData, setTitheData] = useState<any>(null);
  const [totalTithe, setTotalTithe] = useState(0);
  const [monthlyTithe, setMonthlyTithe] = useState(0);
  const [activeTithers, setActiveTithers] = useState(0);
  const [averageTithe, setAverageTithe] = useState(0);
  const [lastServiceTithe, setLastServiceTithe] = useState(0);

  const [deleteError, setDeleteError] = useState("");

  const [search, setSearch] = useState("");

  let [deleteModal, setDeleteModal] = useState(false);
  let [deleteID, setDeleteID] = useState("");

  // Add modal state and functions
  let [isAddTitheOpen, setIsAddTitheOpen] = useState(false);

  function closeAddTitheModal() {
    setIsAddTitheOpen(false);
  }

  function openAddTitheModal() {
    setIsAddTitheOpen(true);
  }

  function openDeleteModal(id: string) {
    setDeleteID(id);
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteID("");
    setDeleteModal(false);
  }

  // const getTitheSum = async (id) => {
  //   const titheRef = collection(db, "tithe")
  //   const titheRefQuery = query(titheRef, orderBy('dateAdded', 'desc'))
  // }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTitheData = async () => {
      setIsLoading(true);
      try {
        let titheSum: any = {};
        let exportDataTmp = [["Date", "Member", "Amount", "TotalAmount"]];
        const titheRef = collection(db, "tithe");
        const titheRefQuery = query(titheRef, orderBy("dateAdded", "desc"));
        const snapshots = await getDocs(titheRefQuery).then((snapshots) => {
          const docs = snapshots.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;

            if (data.date in titheSum) {
              titheSum[data.date] = titheSum[data.date] + data.amount;
            } else {
              titheSum[data.date] = data.amount;
            }
            return data;
          });

          // Calculate totals
          let total = 0;
          let monthlyTotal = 0;
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          const uniqueTithers = new Set();

          docs.forEach((doc) => {
            const titheDate = new Date(doc.date);
            total += doc.amount;

            // Add member to unique tithers set
            if (doc.member && doc.member !== "None") {
              uniqueTithers.add(doc.member);
            }

            // Calculate monthly total
            if (titheDate.getMonth() === currentMonth && 
                titheDate.getFullYear() === currentYear) {
              monthlyTotal += doc.amount;
            }
          });

          // Calculate average monthly tithe
          const monthsWithTithe = Object.keys(titheSum).length;
          const averageMonthly = monthsWithTithe > 0 ? total / monthsWithTithe : 0;

          docs.map((item) => {
            item.sumOfTithe = titheSum[item.date];
            exportDataTmp.push([
              item.date,
              item.member,
              item.amount,
              titheSum[item.date],
            ]);
          });

          setExportData(exportDataTmp);
          setTitheData(docs);
          setTotalTithe(total);
          setMonthlyTithe(monthlyTotal);
          setLastServiceTithe(docs[0]?.amount || 0); // Set last service tithe
          setAverageTithe(Math.round(averageMonthly));
        });
      } catch (error) {
        console.error("Error fetching tithe data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTitheData();
  }, []);

  async function searchHandler() {
    if (search) {
      let titheSum: any = {};
      const titheRef = collection(db, "tithe");
      const titheRefQuery = query(titheRef, where("member", "==", search));

      const snapshots = await getDocs(titheRefQuery).then((snapshots) => {
        const docs = snapshots.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;

          if (data.date in titheSum) {
            titheSum[data.date] = titheSum[data.date] + data.amount;
          } else {
            titheSum[data.date] = data.amount;
          }
          return data;
        });
        docs.map((item) => {
          item.sumOfTithe = titheSum[item.date];
        });
        console.log(docs);
        setTitheData(docs);
      });
    }
  }

  function uploadActivity() {
    try {
      const activityRef = collection(db, "activity");
      const owner: string | null = localStorage.getItem("userEmail");
      var date = new Date();
      var options: any = { hour: "numeric", minute: "2-digit" };
      let currTime = date.toLocaleTimeString("en-US", options);
      let activity = "Delete";
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
          setDeleteError("Could not delete");
        });
    } catch (error) {
      setDeleteError("Could not delete");
    }
  }

  function deleteHandler() {
    const docRef = doc(db, "tithe", deleteID);
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

  const summaryData = [
    {
      title: "Total Tithe",
      figure: isLoading ? <LoadingValue /> : 
        titheData ? `GHS ${totalTithe}` : "No data",
    },
    {
      title: "This Month",
      figure: isLoading ? <LoadingValue /> :
        titheData ? `GHS ${monthlyTithe}` : "No data",
    },
    {
      title: "Last Service",
      figure: isLoading ? <LoadingValue /> :
        titheData ? `GHS ${lastServiceTithe}` : "No data",
    },
    {
      title: "Average per Service",
      figure: isLoading ? <LoadingValue /> :
        titheData ? `GHS ${averageTithe}` : "No data",
    },
  ];

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Tithe</h2>
        <div className="flex gap-4">
          <button className="btn-primary" onClick={() => openAddTitheModal()}>
            Add Tithe
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
                <th className="table-cell">Name</th>
                <th className="table-cell">Amount</th>
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
            ) : titheData && titheData.length > 0 ? (
              <tbody>
                {titheData.map((data: any) => (
                  <tr key={data.id} className="table-row">
                    <td className="table-cell">{data.date}</td>
                    <td className="table-cell">{data.name}</td>
                    <td className="table-cell">GHS {data.amount}</td>
                    <td className="table-cell">
                      <button 
                        onClick={() => handleDelete(data.id)}
                        className="text-red-500 hover:text-red-700"
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
                    No tithe records found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Modals */}
      {/* ... existing modals ... */}

      {/* Add Tithe Modal */}
      <Transition appear show={isAddTitheOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeAddTitheModal}>
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
                    Add Tithe
                  </Dialog.Title>
                  <AddTithe />
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
                    Delete Tithe
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this tithe record?
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
