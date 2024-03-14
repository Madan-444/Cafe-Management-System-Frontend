import React, { useRef, useState } from 'react'
import Layout from '../Components/Layout/Layout'
import { SimpleBarChart } from '@carbon/charts-react'
import '@carbon/charts/styles.css'
import { ReactTyped } from "react-typed";
import { useQuery } from 'react-query';
import { apiRequest } from '../api/api.services';
import useAxiosPrivate from '../CustomHooks/useAxiosPrivate';
import { toast } from 'react-toastify';


const Dashboard = () => {
  const typedRef = useRef(null);
  const axiosPrivate = useAxiosPrivate()
  const [dashboardData,setDashboardData] = useState(null)

  const barchartOptions = {
    title: 'Order Vs. Menu Analysis',
    axes: {
      left: {
        mapsTo: 'totalOrder',
      },
      bottom: {
        mapsTo: 'name',
        scaleType: 'labels',
      },
    },
    height: '400px',
  }

  let { isError } = useQuery(
    ["get-dashboard"],
    () => {
        return apiRequest(axiosPrivate, {
            url: `/dashboard/get-statics`,
        });
    },
    {
        onSuccess: (res) => {
          setDashboardData(res.data)

        },
        onError: (e) => {
            if (e) {
                toast("Error on fetching dashboard data")
            }
        },
    }
);

  const handleTypingComplete = () => {
    if (typedRef.current) {
      typedRef.current.reset();
    }
  };


  return (
    <Layout>
      <div className='dashboard_container'>
        <div className='text-dash'>
          <div className='dashboard-heading'>
          <ReactTyped strings={["Welcome to dashboard !!!","Welcome to LAYANA !!!"]} typeSpeed={30} loop onComplete={handleTypingComplete} />
          </div>
          <div className='dashboard_card'>
            <div className='dashboard_card-box'>
              <div className='dashboard_card-box_item'>
                <p>{dashboardData?.totalMenu}</p>
                <p>Total Menu</p>
              </div>
              <div className='dashboard_card-box_item'>
                <p>{dashboardData?.totalOrders}</p>
                <p>Total Order</p>
              </div>
              <div className='dashboard_card-box_item'>
                <p>{dashboardData?.totalPendingOrders}</p>
                <p>Pending Order</p>
              </div>
              <div className='dashboard_card-box_item'>
                <p>{dashboardData?.totalCanceledOrders}</p>
                <p>Canceled Order</p>
              </div>
              <div className='dashboard_card-box_item'>
                <p>{dashboardData?.totalCompleteOrders}</p>
                <p>Complete Order</p>
              </div>

            </div>

            <div className='dashboard_card-chart'>
              <SimpleBarChart
                data={dashboardData?.orderVsMenuList ?? []}
                options={barchartOptions}
              ></SimpleBarChart>
            </div>
          </div>
        </div>
      </div>
    </Layout>

  )
}

export default Dashboard