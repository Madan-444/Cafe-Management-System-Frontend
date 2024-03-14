import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Button, Table } from 'antd';
import cafeLogo from '../../Components/Navbar/images/logo.png';
import Layout from '../Layout/Layout';
import { useQuery } from 'react-query';
import { apiRequest } from '../../api/api.services';
import useAxiosPrivate from '../../CustomHooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: "center",
    flexDirection: "column",
    objectFit: "cover",

  },
  section: {
    width: "100%",
    display: 'flex',
    alignItems: "center",
    objectFit: "cover"

  },
  section_head: {
    width: "100%",
    marginTop: "20px",
    padding: "0px 20px",
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",

  },
  imgLogo: {
    height: "90px",
    width: "120px",
    objectFit: "contain",
    marginTop: "20px"
  },
  table_heading: { display: "flex", flexDirection: "row", marginTop: "40px", justifyContent: "space-between", alignItems: "center", padding: "5px 20px" },
  order_item: {
    display: "flex", flexDirection: "row", backgroundColor: "#f0f0f0", justifyContent: "space-between", alignItems: "center", padding: "10px 20px"
  },
  table_footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: "5px"
  },
  footer_content: {
    backgroundColor: "#f0f0f0",
    padding: "10px"
  },
  footer_text: {
    marginTop: "8px",
    fontSize: "14px"
  }

});

const MyDocument = ({ orderDetails }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image src={cafeLogo} style={styles.imgLogo} />
          <Text style={{ fontSize: "14px" }}>Layana Cafe and Service</Text>
          <Text style={{ fontSize: "14px",margin: "5px 0" }}>Kathmandu, Nepal</Text>
          <Text style={{ fontSize: "14px" }}>Telephone : 01787878, 9876565656</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.section_head}>
            <Text style={{ fontSize: "15px" }}>Invoice Number : {orderDetails?.invoice_number}</Text>
            <Text style={{ fontSize: "15px" }}>Payment Method : {orderDetails?.payment_method}</Text>
          </View>
          <View style={styles.section_head}>
            <Text style={{ fontSize: "15px" }}>Order Name : {orderDetails?.order_name}</Text>
            <Text style={{ fontSize: "15px" }}>Status : {orderDetails?.status}</Text>
          </View>

        </View>
        <View style={styles.table_heading}>
          <Text style={{ width: "60%",fontSize: "15px", fontWeight: "bold" }}>Order Name</Text>
          <Text style={{ width: "20%",fontSize: "15px", fontWeight: "bold" }}>Quantity</Text>
          <Text style={{ width: "20%",fontSize: "15px", fontWeight: "bold" }}>Price</Text>
        </View>
        <View style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px" }}>
          {orderDetails?.itemsList?.map((el) => {
            return (
              <View style={styles.order_item}>
                <Text style={{ width: "60%",fontSize: "14px" }}>{el.product_name}</Text>
                <Text style={{ width: "20%",fontSize: "14px" }}>{el.quantity}</Text>
                <Text style={{ width: "20%",fontSize: "14px" }}>{el.price}</Text>
              </View>
            )
          })}
        </View>
        <View style={styles.table_footer}>
          <View style={styles.footer_content}>
            <Text style={styles.footer_text}>Sub-total : Rs.{orderDetails.sub_total}</Text>
            <Text style={styles.footer_text}>Service Tax: Rs.  {orderDetails.service_charge}</Text>
            <Text style={styles.footer_text}>Vat %: Rs.  {orderDetails.vat_amount}</Text>
            <Text style={styles.footer_text}>Discount: Rs. {orderDetails.discount}</Text>
            <Text style={styles.footer_text}>Grand Total: Rs. {orderDetails.sub_total + orderDetails.service_charge + orderDetails.vat_amount - orderDetails.discount}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}


function OrderDetails() {
  const { orderId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const history = useNavigate()
  const location = useLocation()

  const [orderDetails, setOrderDetails] = useState({})
  console.log("🚀 ~ OrderDetails ~ orderDetails:", orderDetails)

  let { isError } = useQuery(
    ["get-orderDetails"],
    () => {
      return apiRequest(axiosPrivate, {
        url: `/order/get-order-details/${orderId}`,
      });
    },
    {
      onSuccess: (res) => {
        setOrderDetails(res.data)

      },
      onError: (e) => {
        if (e) {
          toast("Error on fetching order details")
        }
      },
    }
  );

  const columns = [
    {
      title: 'S.N.',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Total',
      render: (_, data) => {
        return (
          <div>
            {data.quantity * data.price}
          </div>
        )
      }
    },
  ];


  return (
    <Layout>
      <div className='dashboard_container'>
        <div className='text-dash'>
          <div>
            <Button onClick={() => history(-1)} className='go-backbtn'>Go Back</Button>
          </div>
          <div className='category-heading'>Order Details</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="breadcrumb">
              <span><Link to='/' style={{textDecoration: "none"}}>Home</Link></span> / <Link to='/orders' style={{textDecoration: "none"}}><span > Order List</span> </Link> / <Link style={{textDecoration: "none"}}>
              <span className={`${location.pathname === `order-details/${orderId}`&& 'path-active'}`}>Order Details</span></Link>
            </div>

          </div>
          <div className='order-details'>
            <div className='order-details_downloadbtn'>
              <BlobProvider document={<MyDocument orderDetails={orderDetails} />}>
                {({ blob, url, loading, error }) => {
                  if (loading) {
                    return <p>Loading...</p>;
                  }
                  if (error) {
                    return <p>An error occurred</p>;
                  }
                  return (
                    <a href={url} download="order_details.pdf">
                      <Button type="primary" size='large'>Export To PDF</Button>
                    </a>
                  );
                }}
              </BlobProvider>
            </div>
            <div className="order-details_img">
              <img src={cafeLogo} />
              <p>Kathmandu Nepal</p>
              <p>Telephone : 01787878, 9876565656</p>
            </div>
            <div className="order-details_des">

              <div>
                <p>Invoice Number : <span>{orderDetails.invoice_number}</span></p>

              </div>
              <div>
                <p>Order Name : <span>{orderDetails.order_name}</span></p>
                <p>Payment Method : <span>{orderDetails.payment_method}</span></p>

              </div>
              <div>
                <p>Status : <span>{orderDetails.status}</span></p>
                <p>Total Amount : <span>{orderDetails.sub_total}</span></p>

              </div>

            </div>
            <div className="order-details_table">
              <Table dataSource={orderDetails.itemsList} columns={columns} pagination={false} />
              <div className='order-details_table-footer'>
                <div className="order-details_table-footer_card">
                  <p>Sub-total :<span>Rs.{orderDetails.sub_total}</span></p>
                  <p>Service Tax:  <span>Rs. {orderDetails.service_charge}</span></p>
                  <p>Vat %:  <span> Rs. {orderDetails.vat_amount}</span></p>
                  <p>Discount :  <span>Rs. {orderDetails.discount}</span></p>
                  <p>Grand Total :  <span>Rs. {orderDetails.sub_total + orderDetails.service_charge + orderDetails.vat_amount - orderDetails.discount}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OrderDetails