"use client";

import { FC, useEffect } from "react";
import { Button, Card, Dropdown, Tooltip, useThemeMode } from "flowbite-react";
import Chart from "react-apexcharts";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTransactions,
  fetchBalances,
  fetchWallets,
  redeemClaims,
  useBalanceSelector,
} from "../../reducers/dashboardSlice";
import { AppDispatch } from "@/src/store";
import Notification from "../../components/Notification";

export default function AdminPage() {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <SalesThisWeek />
    </div>
  );
}

const SalesChart: FC = function () {
  const { mode } = useThemeMode();
  const isDarkTheme = mode === "dark";

  const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
  const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
  const opacityFrom = isDarkTheme ? 0 : 1;
  const opacityTo = isDarkTheme ? 0 : 1;

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom,
        opacityTo,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: [
        "01 Feb",
        "02 Feb",
        "03 Feb",
        "04 Feb",
        "05 Feb",
        "06 Feb",
        "07 Feb",
      ],
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return "$" + value;
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Revenue",
      data: [0, 235, 520, 1120, 3200, 4501, 5038],
      color: "#1A56DB",
    },
  ];

  return <Chart height={420} options={options} series={series} type="area" />;
};

const Datepicker: FC = function () {
  return (
    <span className="text-sm text-gray-600">
      <Dropdown inline label="Last 7 days">
        <Dropdown.Item>
          <strong>Sep 16, 2021 - Sep 22, 2021</strong>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Yesterday</Dropdown.Item>
        <Dropdown.Item>Today</Dropdown.Item>
        <Dropdown.Item>Last 7 days</Dropdown.Item>
        <Dropdown.Item>Last 30 days</Dropdown.Item>
        <Dropdown.Item>Last 90 days</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Custom...</Dropdown.Item>
      </Dropdown>
    </span>
  );
};

const SalesThisWeek: FC = function () {
  const dispatch = useDispatch<AppDispatch>();
  const { received, paid } = useSelector(useBalanceSelector);

  useEffect(() => {
    dispatch(fetchBalances());
    dispatch(fetchAllTransactions());
    dispatch(fetchWallets({ walletType: "Sender" }));
    dispatch(fetchWallets({ walletType: "Receiver" }));
  }, []);

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:text-white sm:p-6 xl:p-8">
      <div className="mb-4 flex h-[180px] items-center gap-4">
        <Card className="h-full">
          <h4 className="text-2xl font-bold ">Balance</h4>
          <div className="flex gap-10 dark:text-white">
            <div>
              <span className="flex items-center">
                Cash
                <Tooltip
                  content="USDC is a regulated, digital currency that can always be redeemed 1:1 for US dollars"
                  style="light"
                >
                  <HiOutlineInformationCircle className="h-5 w-5" />
                </Tooltip>
              </span>
              <h5 className="text-2xl font-bold tracking-tight">
                $5,385.00 <span className="text-sm">USDC</span>
              </h5>
            </div>
            <div>
              <span>Escrowed</span>
              <h5 className="text-gray-90 text-2xl font-bold tracking-tight">
                $2,000.00 <span className="text-sm">USDC</span>
              </h5>
            </div>
            <div>
              <span>Liability</span>
              <h5 className="text-gray-90 text-2xl font-bold tracking-tight">
                ${paid.toFixed(2)} <span className="text-sm">USDC</span>
              </h5>
            </div>
            <div>
              <span>Available</span>
              <h5 className="stext-gray-90 text-2xl font-bold tracking-tight">
                ${(2000 - paid).toFixed(2)}{" "}
                <span className="text-sm">USDC</span>
              </h5>
              <Button
                className="ml-auto mt-2"
                size="xs"
                onClick={() => dispatch(redeemClaims())}
              >
                Redeem
              </Button>
            </div>
          </div>
        </Card>
        <Card className="h-full max-w-lg">
          <div className="flex flex-col">
            <div className="mb-4">
              Total Amount Received
              <h5 className="tracking-tigh text-2xl font-bold">${received}</h5>
            </div>
            <div>
              Total Amount Paid
              <h5 className="text-2xl font-bold tracking-tight">${paid}</h5>
            </div>
          </div>
        </Card>
        {/* <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            $5,385 USDC
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            Wallet Balance
          </h3>
        </div> */}
        {/* <div className="flex flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          12.5%
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div> */}
      </div>
      <SalesChart />
      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <Notification
          asyncActionKey="redeemClaims"
          messages={{
            success: "Successfully redeemed funds",
            error: "Sorry, tihe blockchain network is slow right now",
            pending: "Redeeming Fund...",
          }}
        />
      </div>
    </div>
  );
};
