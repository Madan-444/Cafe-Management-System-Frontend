import React, { useState } from 'react'
import Layout from '../Layout/Layout'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Modal, Table } from 'antd'
import { apiRequest } from '../../api/api.services'
import useAxiosPrivate from '../../CustomHooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

function OrderList() {
    const location = useLocation()
    const history = useNavigate()
    const axiosPrivate = useAxiosPrivate()
    const [orderList,setOrderList] = useState([])
    const [cancelOrder,setCancelOrder] = useState(null)
    console.log("🚀 ~ OrderList ~ cancelOrder:", cancelOrder)
    const [completeOrder,setCompleteOrder] = useState(null)
    const queryClient = useQueryClient()

    const [paginationOption, setPaginationOption] = useState({
        total: 0,
        pageSize: 10,
        current: 1,
        showSizeChanger: true,
    
      })

    let { isError } = useQuery(
        ["get-order"],
        () => {
            return apiRequest(axiosPrivate, {
                url: `/order/get-order?page=${paginationOption.current}&pageSize=${paginationOption.pageSize}&sortBy=asc`,
            });
        },
        {
            onSuccess: (res) => {
                setOrderList(res.data?.orderList)

            },
            onError: (e) => {
                if (e) {
                    toast("Error on fetching order list")
                }
            },
        }
    );

    const columns = [
        {
          title: 'S.N.',
          dataIndex: 'order_id',
          key: 'order_id',
        },
        {
          title: 'Order Name',
          dataIndex: 'order_name',
          key: 'order_name',
        },
        {
          title: 'Order Method',
          dataIndex: 'payment_method',
          key: 'payment_method',
        },
        {
          title: 'Total Amount',
          dataIndex: 'total_amount',
          key: 'total_amount',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          align: "center",
          key: 'action',
          render: (_, data) => {
            return (
              <div className='category-buttons'>
                <Button onClick={()=> {
                  setCancelOrder(data)
                }}>Cancel</Button>
                <Button onClick={()=> {
                  setCompleteOrder(data)
                }}>Complete</Button>
                <Button onClick={()=> {
                    history(`/order-details/${data.order_id}`)
                }}>View Details</Button>
              </div>
            )
          }
        },
      ];

      const handleTableChange = (pagination) => {
        setPaginationOption(prevPagination => ({
          ...prevPagination,
          ...pagination
        }));
        queryClient.invalidateQueries("get-report");
      }

  const closeCancelModal = ()=> {
    setCancelOrder(null)
  }
  const closeCompleteModal = ()=> {
    setCompleteOrder(null)

  }

  const handleCancelOrder = ()=> {
    cancelOrderMutate()
  }

  const {
    mutate: cancelOrderMutate,

  } = useMutation(
    () =>
      apiRequest(axiosPrivate, {
        url: `/order/change-status/${cancelOrder.order_id}?status=CANCEL`,
        method: "put",

      }),
    {
      onSuccess: (res) => {
        toast("Order Canceled Sucessfully")
        closeCancelModal();
        queryClient.invalidateQueries('get-order')
      },
       onError: (e) => {
        toast("Error on canceling order")
      },
    }
  );

  const handleCompleteOrder = ()=> {
    completeOrderMutate()
  }

  const {
    mutate: completeOrderMutate,

  } = useMutation(
    () =>
      apiRequest(axiosPrivate, {
        url: `/order/change-status/${completeOrder.order_id}?status=COMPLETE`,
        method: "put",

      }),
    {
      onSuccess: (res) => {
        toast("Order Completed Sucessfully")
        closeCompleteModal();
        queryClient.invalidateQueries('get-order')
      },
       onError: (e) => {
        console.log("the errr",e)
      },
    }
  );


  return (
    <Layout>
    <div className='dashboard_container'>

        <div className='text-dash'>
            <div className='category-heading'>Order List</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="breadcrumb">
                    <span><Link to='/'>Home</Link></span> / <span className={`${location.pathname === '/menu' && 'path-active'}`}> Order List</span>
                </div>
                <div style={{ marginRight: "20px",marginBottom: "20px" }}>
                    <Link to='/take-order'><Button type='primary'>Take Order</Button></Link>
                </div>

            </div>
            <div>
                <Table dataSource={orderList} columns={columns} pagination={paginationOption} onChange={handleTableChange} />
            </div>
        </div>
    </div>
    <Modal title="Cancel Order" open={cancelOrder ? true : false} onCancel={closeCancelModal} onOk={handleCancelOrder} >
        <p style={{margin: "20px 0",textAlign: "center",fontSize: "24px"}}>Are you sure want to CANCEL this order ??</p>
      </Modal>
    <Modal title="Complete Order" open={completeOrder ? true : false} onCancel={closeCompleteModal} onOk={handleCompleteOrder} >
        <p style={{margin: "20px 0",textAlign: "center",fontSize: "24px"}}>Are you sure want to COMPLETE this order ??</p>
      </Modal>
    
</Layout>
  )
}

export default OrderList