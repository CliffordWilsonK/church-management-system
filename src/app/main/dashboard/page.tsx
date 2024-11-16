"use client";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
Chart.defaults.scale.grid.display = false;
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { LoadingValue, LoadingCard } from "@/components/loading/Loading";

export default function Dashboard() {
  // let growthYear = 2023;
  const [growthYear, setGrowthYear] = useState<any>(
    new Date().getFullYear().toString()
  );

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [members, setMembers] = useState<any>(null);
  const data = {
    labels: labels,
    datasets: [
      {
        label: `Membership growth for ${growthYear}`,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        data: members,
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const [memberCount, setMemberCount] = useState<any>(null);
  const [departmentCount, setDepartmentCount] = useState<any>(null);
  const [offeringCount, setOfferingCount] = useState<any>(null);
  const [contributionCount, setContributionCount] = useState<any>(null);
  const [offeringDate, setOfferingDate] = useState<any>(null);
  const [titheCount, setTitheCount] = useState<any>(null);
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

  const currMonth = new Date().getMonth();
  const currYear = new Date().getFullYear();

  const [isLoading, setIsLoading] = useState(true);

  // Add chart options configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `Members: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  async function getMembers() {
    const monthSum: any = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
    const dptCount: any = {
      "Men Ministry": 0,
      "Women Ministry": 0,
      "Youth Ministry": 0,
      "Children Ministry": 0,
    };
    const memberRef = collection(db, "members");
    const snapshots = await getDocs(memberRef).then((snapshots) => {
      setMemberCount(snapshots.docs.length);
      snapshots.docs.map((doc) => {
        const data = doc.data();
        let dpt = data.department;
        dptCount[dpt] = dptCount[dpt] + 1;

        let dateOfFirstVisit = new Date(data.dateOfFirstVisit);
        let yearOfFistVisit = dateOfFirstVisit.getFullYear().toString();
        let monthOfFirstVisit = monthNames[dateOfFirstVisit.getMonth()];
        console.log("year of first visit", yearOfFistVisit);
        console.log("month of first visit", monthOfFirstVisit);
        if (yearOfFistVisit == growthYear) {
          monthSum[monthOfFirstVisit] = monthSum[monthOfFirstVisit] + 1;
        }
      });
    });
    // setMembers([5,10,20,20, 30, 40, 50, 60, 50, 40 , 20, 20])
    setMembers(Object.values(monthSum).slice(0, currMonth + 1));
    console.log(monthSum);
    console.log(Object.values(monthSum).slice(0, currMonth + 1));
    setDepartmentCount(dptCount);
  }

  function generateYears() {
    let years = [];
    for (let year = 2018; year <= 2030; year++) {
      years.push(year);
    }
    return years;
  }

  let selectYear = generateYears();

  async function getOffering() {
    let offeringSum: number = 0;
    const offeringRef = collection(db, "offering");
    const offeringRefQuery = query(offeringRef, orderBy("date", "desc"));
    const count = 0;
    const snapshots = await getDocs(offeringRefQuery).then((snapshots) => {
      const offeringDocs = snapshots.docs.map((doc) => {
        const data = doc.data();
        let offeringDate = new Date(data.date);
        let offeringYear = offeringDate.getFullYear();

        if (offeringYear == currYear) {
          offeringSum = offeringSum + data.amount;
        }
        return data;
      });
      setOfferingCount(offeringSum);
    });
  }

  async function getContribution() {
    let contributionSumForTheYear: number = 0;
    const contributionRef = collection(db, "contribution");
    const snapshots = await getDocs(contributionRef).then((snapshots) => {
      snapshots.docs.map((doc) => {
        const data = doc.data();

        let contributionDate = new Date(data.date);
        let contributionYear = contributionDate.getFullYear();

        if (contributionYear == currYear) {
          contributionSumForTheYear = contributionSumForTheYear + data.amount;
        }
      });
      setContributionCount(contributionSumForTheYear);
      // console.log('contribution sum for the year', contributionSumForTheYear)
    });
  }

  async function getTithe() {
    let titheSum: number = 0;
    const titheRef = collection(db, "tithe");
    const titheRefQuery = query(titheRef, orderBy("dateAdded", "desc"));
    const snapshots = await getDocs(titheRefQuery).then((snapshots) => {
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;

        let titheDate = new Date(data.date);
        let titheYear = titheDate.getFullYear();

        if (titheYear == currYear) {
          titheSum = titheSum + data.amount;
        }
      });

      setTitheCount(titheSum);
    });
  }

  const row1content = [
    {
      title: "Total Members",
      figure: isLoading ? <LoadingValue /> : 
        memberCount || memberCount === 0 ? memberCount : "No data",
    },
    {
      title: `Offering ${currYear}`,
      figure: isLoading ? <LoadingValue /> :
        offeringCount || offeringCount === 0 ? `GHS ${offeringCount}` : "No data",
    },
    {
      title: `Project ${currYear}`,
      figure: isLoading ? <LoadingValue /> :
        contributionCount || contributionCount === 0 ? `GHS ${contributionCount}` : "No data",
    },
    {
      title: "Tithe",
      figure: isLoading ? <LoadingValue /> :
        titheCount || titheCount === 0 ? `GHS ${titheCount}` : "No data",
    },
  ];
  const col1content = [
    {
      title: "Men Ministry",
      figure: isLoading ? <LoadingValue /> :
        departmentCount ? departmentCount["Men Ministry"] : "No data",
    },
    {
      title: "Women Ministry",
      figure: isLoading ? <LoadingValue /> :
        departmentCount ? departmentCount["Women Ministry"] : "No data",
    },
    {
      title: "Youth Ministry",
      figure: isLoading ? <LoadingValue /> :
        departmentCount ? departmentCount["Youth Ministry"] : "No data",
    },
    {
      title: "Children ministry",
      figure: isLoading ? <LoadingValue /> :
        departmentCount ? departmentCount["Children Ministry"] : "No data",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getMembers(),
          getOffering(),
          getContribution(),
          getTithe()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [growthYear]);

  // useEffect(() => {}, []);

  return (
    <main className="page-container">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {row1content.map((content, index) => (
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

      {/* Chart and Department Stats Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-3 content-card">
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold text-gray-800 text-lg">
              {`Membership growth for ${growthYear}`}
            </span>
            <div className="select-container w-40">
              <select
                className="select-field"
                value={growthYear}
                onChange={(e) => setGrowthYear(e.target.value)}
              >
                {selectYear.map((yr, idx) => (
                  <option key={idx} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <LoadingCard />
            </div>
          ) : (
            <Line data={data} options={chartOptions} />
          )}
        </div>

        {/* Department Stats */}
        <div className="lg:col-span-1 content-card">
          <h3 className="section-title">Department Statistics</h3>
          <div className="space-y-6">
            {col1content.map((content, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-2xl font-semibold text-gray-800">
                  {content.figure}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {content.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
