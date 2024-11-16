"use client";

import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import AddContribution from "@/components/addContribution/AddContribution";
import ViewContribution from "@/components/viewContribution/ViewContribution";

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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface datesAddedInterface {
  date: string;
  amount: number;
}

export interface viewContributionDataInterface {
  monthYear: string;
  totalContributions: number;
  // datesAdded: datesAddedInterface[];
  datesAdded: any;
}

export default function Project() {
  let [isAddContributionOpen, setIsAddContributionOpen] = useState(false);
  let [isViewContributionOpen, setIsViewContributionOpen] = useState(false);
  let [viewContributionData, setViewContributionData] =
    useState<viewContributionDataInterface | null>();

  function closeAddContributionModal() {
    setIsAddContributionOpen(false);
  }

  function openAddContributionModal() {
    setIsAddContributionOpen(true);
  }

  function closeViewContributionModal() {
    setIsViewContributionOpen(false);
  }

  function openViewContributionModal() {
    setIsViewContributionOpen(false);
  }

  const [contributionData, setContributionData] = useState<any>(null);
  const [contributionAggData, setContributionAggData] = useState<any>(null);

  let [exportData, setExportData] = useState<any>(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [totalProject, setTotalProject] = useState(0);
  const [monthlyProject, setMonthlyProject] = useState(0);
  const [lastContribution, setLastContribution] = useState(0);

  // Update summaryData with loading states
  const summaryData = [
    {
      title: "Total Project Contributions",
      figure: isLoading ? <LoadingValue /> : 
        contributionData ? `GHS ${totalProject}` : "No data",
    },
    {
      title: "This Month",
      figure: isLoading ? <LoadingValue /> :
        contributionData ? `GHS ${monthlyProject}` : "No data",
    },
    {
      title: "Last Contribution",
      figure: isLoading ? <LoadingValue /> :
        contributionData ? `GHS ${lastContribution}` : "No data",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const monthSum: any = {};
        let exportDataTmp = [["date", "amount"]];
        let total = 0;
        let monthlyTotal = 0;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const contributionRef = collection(db, "contribution");
        const contributionRefQuery = query(
          contributionRef,
          orderBy("date", "desc")
        );
        const snapshots = await getDocs(contributionRefQuery).then(
          (snapshots) => {
            const docs = snapshots.docs.map((doc) => {
              const data = doc.data();
              exportDataTmp.push([data.date, data.amount]);
              data.id = doc.id;

              // Calculate totals
              total += data.amount;
              
              // Process date once
              const contributionDate = new Date(data.date);
              const contributionYear = contributionDate.getFullYear();
              const contributionMonth = data.month;
              const contributionFullDate = contributionMonth + " " + contributionYear;

              // Calculate monthly total
              if (contributionDate.getMonth() === currentMonth && 
                  contributionYear === currentYear) {
                monthlyTotal += data.amount;
              }

              // Update month sum
              if (contributionFullDate in monthSum) {
                monthSum[contributionFullDate] = monthSum[contributionFullDate] + data.amount;
              } else {
                monthSum[contributionFullDate] = data.amount;
              }

              return data;
            });

            // Update state with calculated values
            setTotalProject(total);
            setMonthlyProject(monthlyTotal);
            setLastContribution(docs[0]?.amount || 0);

            docs.map((item) => {
              let itemDate = new Date(item.date);
              let itemYear = itemDate.getFullYear();
              let itemMonth = item.month;
              let itemFullDate = itemMonth + " " + itemYear;
              item.monthYear = itemFullDate;
              item.totalMonthlyContribution = monthSum[itemFullDate];
            });
            setExportData(exportDataTmp);
            setContributionData(docs);
            setContributionAggData(monthSum);
          }
        );
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Project Contributions</h2>
        <div className="flex gap-4">
          <button 
            className="btn-primary"
            onClick={() => setIsAddContributionOpen(true)}
          >
            Add Contribution
          </button>
          {exportData && <ExportData data={exportData} />}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-cell">Date</th>
              <th className="table-cell">Total monthly contribution</th>
            </tr>
          </thead>

          {contributionAggData ? (
            <tbody>
              {Object.keys(contributionAggData).map((item, index) => (
                <tr
                  key={index}
                  className="table-row"
                  onClick={() => {
                    setViewContributionData({
                      monthYear: item,
                      totalContributions: contributionAggData[item],
                      datesAdded: contributionData,
                    });
                    setIsViewContributionOpen(true);
                  }}
                >
                  <td className="table-cell">{item}</td>
                  <td className="table-cell">{contributionAggData[item]}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <div className="mt-5 text-gray-500">
              <span>Loading contribution data...</span>
            </div>
          )}
        </table>
      </div>

      <Transition appear show={isAddContributionOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`${montserrat.variable} font-sans relative z-10 text-sm`}
          onClose={closeAddContributionModal}
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
                <Dialog.Panel className="transform w-auto text-left overflow-hidden rounded-2xl bg-white p-6  align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    Add Contribution
                  </Dialog.Title>
                  <AddContribution />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isViewContributionOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`${montserrat.variable} font-sans relative z-10 text-sm`}
          onClose={closeViewContributionModal}
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
                <Dialog.Panel className="transform w-auto overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 mb-3 text-center"
                  >
                    Contributions
                  </Dialog.Title>
                  <ViewContribution data={viewContributionData} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
