"use client";

import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import { Montserrat } from "@next/font/google";
import ExportData from "@/components/exportData/ExportData";
import { LoadingValue, LoadingTable } from "@/components/loading/Loading";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

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
import AddAsset from "@/components/addAsset/AddAsset";

export default function Asset() {
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isViewAssetOpen, setIsViewAssetOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const [assetData, setAssetData] = useState<any>(null);
  //   const [viewAssetData, setViewAssetData] = useState<any>("");
  let [exportData, setExportData] = useState<any>(null);

  let [deleteModal, setDeleteModal] = useState(false);
  let [deleteID, setDeleteID] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  // Update summaryData with loading states
  const summaryData = [
    {
      title: "Total Assets",
      figure: isLoading ? <LoadingValue /> : 
        assetData ? assetData.length : "No data",
    },
    {
      title: "Total Value",
      figure: isLoading ? <LoadingValue /> :
        assetData ? `GHS ${totalValue}` : "No data",
    },
  ];

  function openDeleteModal(id: string) {
    setDeleteID(id);
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteID("");
    setDeleteModal(false);
  }

  function closeAddAssetModal() {
    setIsAddAssetOpen(false);
  }

  function openAddAssetModal() {
    setIsAddAssetOpen(true);
  }

  function closeViewAssetModal() {
    setIsViewAssetOpen(false);
  }

  function openViewAssetModal() {
    setIsViewAssetOpen(false);
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
          setDeleteError("Could not delete");
        });
    } catch (error) {
      setDeleteError("Could not delete");
    }
  }

  function deleteHandler() {
    const docRef = doc(db, "asset", deleteID);
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

  function handleDelete(id: string) {
    setDeleteID(id);
    setDeleteModal(true);
  }

  useEffect(() => {
    const fetchAssetData = async () => {
      setIsLoading(true);
      try {
        let exportDataTmp = [
          [
            "Name",
            "Type",
            "Model",
            "Serial Number",
            "Tag Number",
            "Location",
            "Date purchased",
          ],
        ];
        const assetRef = collection(db, "asset");
        const assetRefQuery = query(assetRef, orderBy("purchaseDate", "desc"));
        const snapshots = await getDocs(assetRefQuery).then((snapshots) => {
          const docs = snapshots.docs.map((doc) => {
            const data = doc.data();
            exportDataTmp.push([
              data.name,
              data.type,
              data.model,
              data.serialNo,
              data.tagNo,
              data.location,
              data.purchaseDate,
            ]);
            data.id = doc.id;
            return data;
          });

          // Calculate total value
          const total = docs.reduce((sum, asset) => sum + (asset.value || 0), 0);
          setTotalValue(total);
          
          setAssetData(docs);
          setExportData(exportDataTmp);
        });
      } catch (error) {
        console.error("Error fetching asset data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssetData();
  }, []);

  async function searchHandler() {
    if (search) {
      const assetRef = collection(db, "asset");
      const assetRefQuery = query(assetRef, where(searchBy, "==", search));
      const snapshots = await getDocs(assetRefQuery);

      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      console.log(docs);
      setAssetData(docs);
    }
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Assets</h2>
        <div className="flex gap-4">
          <button 
            className="btn-primary"
            onClick={() => setIsAddAssetOpen(true)}
          >
            Add Asset
          </button>
          {exportData && <ExportData data={exportData} />}
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8 content-card">
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Name</th>
                <th className="table-cell">Quantity</th>
                <th className="table-cell">Value</th>
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
            ) : assetData && assetData.length > 0 ? (
              <tbody>
                {assetData.map((data: any) => (
                  <div key={data.id} className="content-card">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-xl font-semibold text-gray-800 mb-2">
                          {data.name}
                        </span>
                        <span className="text-sm text-gray-500 mb-2">
                          Quantity: {data.quantity}
                        </span>
                        <span className="text-sm text-gray-500">
                          Status: {data.status}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDelete(data.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Delete asset"
                        aria-label={`Delete ${data.name}`}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={4} className="table-cell text-center text-gray-500">
                    No assets found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10"
          onClose={() => setDeleteModal(false)}
        >
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
                  Delete Asset
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete this asset? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button className="btn-secondary" onClick={() => setDeleteModal(false)}>
                    Cancel
                  </button>
                  <button className="btn-danger" onClick={deleteHandler}>
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Asset Modal */}
      <Transition appear show={isAddAssetOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`${montserrat.variable} font-sans relative z-10 text-sm`}
          onClose={closeAddAssetModal}
        >
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
                <Dialog.Panel className="transform min-w-[30%] text-left overflow-hidden rounded-2xl bg-white p-6  align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    Add Asset
                  </Dialog.Title>
                  <AddAsset />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {deleteError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span>{deleteError}</span>
        </div>
      )}
    </div>
  );
}
