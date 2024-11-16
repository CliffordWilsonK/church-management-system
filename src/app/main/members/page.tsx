"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import AddMember from "@/components/addMember/AddMember";
import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import ViewMember from "@/components/viewMember/ViewMember";
import Image from "next/image";

// import { viewDataInterface } from '@/lib/interfaces'

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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

import ExportData from "@/components/exportData/ExportData";

import { LoadingTable, LoadingCard } from "@/components/loading/Loading";

export interface viewDataInterface {
  id: string;
  imageUrl: string;
  welfare: string;
  lastName: string;
  otherNames: string;
  address: string;
  sex: string;
  dateOfBirth: string;
  nationality: string;
  occupation: string;
  phone: string;
  hometown: string;
  region: string;
  residence: string;
  maritalStatus: string;
  department: string;
  spouseName: string;
  fatherName: string;
  motherName: string;
  childrenName: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  declaration: string;
  dateOfFirstVisit: string;
  dateOfBaptism: string;
  membership: string;
  dateOfTransfer: string;
  officerInCharge: string;
  officerSignatureDate: string;
  headPastorSignatureDate: string;
  status: string;
}

import { Montserrat } from "@next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Members() {
  const emptyMemberData = {
    id: "",
    imageUrl: "",
    welfare: "",
    lastName: "",
    otherNames: "",
    address: "",
    sex: "Male",
    dateOfBirth: "",
    nationality: "",
    occupation: "",
    phone: "",
    hometown: "",
    region: "",
    residence: "",
    maritalStatus: "Single",
    department: "Men Ministry",
    spouseName: "",
    fatherName: "",
    motherName: "",
    childrenName: "",
    nextOfKin: "",
    nextOfKinPhone: "",
    declaration: "Unsigned",
    dateOfFirstVisit: "",
    dateOfBaptism: "",
    membership: "",
    dateOfTransfer: "",
    officerInCharge: "",
    officerSignatureDate: "",
    headPastorSignatureDate: "",
    status: "Active",
  };

  let [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  let [isViewMemberOpen, setIsViewMemberOpen] = useState(false);
  let [viewMemberData, setViewMemberData] =
    useState<viewDataInterface>(emptyMemberData);
  const [searchBy, setSearchBy] = useState("lastName");

  let [exportData, setExportData] = useState<any>(null);

  const [memberData, setMemberData] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchMemberData = async () => {
      let exportDataTmp = [
        [
          "Welfare No",
          "Last Name",
          "First Name",
          "Department",
          "Sex",
          "Date of Birth",
          "Date of First Visit",
          "Phone",
          "Status",
          "Address",
          "Nationality",
          "Occupation",
          "Hometown",
          "Region",
          "Residence",
          "Marital Status",
          "Spouse Name",
          "Father's Name",
          "Mother's Name",
          "Children Name",
          "Next of Kin",
          "Next of Kin Phone",
          "Declaration",
          "Date of Baptism",
          "Membership",
          "Date of Transfer",
          "Officer in Charge",
          "Officer Signature Date",
          "Head Pastor Signature Date",
        ],
      ];
      const memberRef = collection(db, "members");
      const memberRefQuery = query(memberRef, orderBy("dateAdded", "desc"));
      const snapshots = await getDocs(memberRefQuery).then((snapshots) => {
        const docs = snapshots.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          exportDataTmp.push([
            data.welfare,
            data.lastName,
            data.firstName,
            data.department,
            data.sex,
            data.dateOfBirth,
            data.dateOfFirstVisit,
            data.phone,
            data.status,
            data.address,
            data.nationality,
            data.occupation,
            data.hometown,
            data.region,
            data.residence,
            data.maritalStatus,
            data.spouseName,
            data.fatherName,
            data.motherName,
            data.childrenName,
            data.nextOfKin,
            data.nextOfKinPhone,
            data.declaration,
            data.dateOfBaptism,
            data.membership,
            data.dateOfTransfer,
            data.officerInCharge,
            data.officerSignatureDate,
            data.headPastorSignatureDate,
          ]);
          return data;
        });
        console.log(docs);
        setMemberData(docs);
        setExportData(exportDataTmp);
      });
    };
    fetchMemberData();
  }, []);

  async function searchHandler() {
    if (search) {
      const memberRef = collection(db, "members");
      const memberRefQuery = query(memberRef, where(searchBy, "==", search));
      const snapshots = await getDocs(memberRefQuery);

      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      console.log(docs);
      setMemberData(docs);
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
        resource: "Member",
        activity: activity,
        owner: owner,
        date: new Date(),
        time: currTime,
      })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          setDeleteError("Could not delete");
        });
    } catch (error) {
      console.log(error);
      setDeleteError("Could not delete");
    }
  }

  function deleteHandler() {
    try {
      const docRef = doc(db, "members", viewMemberData.id);
      const oldImageRef = ref(storage, viewMemberData.imageUrl);
      deleteObject(oldImageRef)
        .then(() => {
          deleteDoc(docRef)
            .then(() => {
              uploadActivity();
            })
            .catch((err) => {
              console.log(err);
              setDeleteError("Could not delete");
            });
        })
        .catch((err) => {
          console.log(err);
          setDeleteError("Could not delete");
        });
    } catch (err) {
      console.log(err);
    }
  }

  function closeAddMemberModal() {
    setIsAddMemberOpen(false);
  }

  function openAddMemberModal() {
    setViewMemberData(emptyMemberData);
    setIsAddMemberOpen(true);
  }

  function closeViewMemberModal() {
    setIsViewMemberOpen(false);
  }

  function openViewMemberModal(data: viewDataInterface) {
    setViewMemberData(data);
    setIsViewMemberOpen(true);
  }

  function editHandler() {
    closeViewMemberModal();
    setIsAddMemberOpen(true);
    // openAddMemberModal()
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Members</h2>
        <div className="flex gap-4">
          <button className="btn-primary" onClick={() => openAddMemberModal()}>
            Add Member
          </button>
          {exportData && <ExportData data={exportData} />}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-cell">Photo</th>
              <th className="table-cell">Welfare</th>
              <th className="table-cell">Last Name</th>
              <th className="table-cell">Other Names</th>
              <th className="table-cell">Department</th>
              <th className="table-cell">Sex</th>
              <th className="table-cell">Date of Birth</th>
              <th className="table-cell">Date of first visit</th>
              <th className="table-cell">Phone</th>
              <th className="table-cell">Status</th>
            </tr>
          </thead>
          {memberData ? (
            <tbody>
              {memberData.map((data: any) => (
                <tr key={data.id} className="table-row">
                  <td className="table-cell">
                    <Image
                      className="rounded-full h-10 w-10"
                      src={data.imageUrl}
                      alt="profile"
                      width={10}
                      height={10}
                    />
                  </td>
                  <td className="table-cell">{data.welfare}</td>
                  <td className="table-cell">{data.lastName}</td>
                  <td className="table-cell">{data.otherNames}</td>
                  <td className="table-cell">{data.department}</td>
                  <td className="table-cell">{data.sex}</td>
                  <td className="table-cell">{data.dateOfBirth}</td>
                  <td className="table-cell">{data.dateOfFirstVisit}</td>
                  <td className="table-cell">{data.phone}</td>
                  <td
                    className={`${
                      data.status == "Active" ? "text-green-600" : "text-red-600"
                    } font-bold`}
                  >
                    {data.status}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={10}>
                  <LoadingTable />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      <Transition appear show={isAddMemberOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeAddMemberModal}>
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
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all h-[90vh] overflow-y-auto">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-4"
                  >
                    {viewMemberData.id ? 'Edit Member' : 'Add New Member'}
                  </Dialog.Title>
                  <AddMember data={viewMemberData} closeModal={closeAddMemberModal} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
