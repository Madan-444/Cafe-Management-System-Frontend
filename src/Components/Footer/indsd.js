import React, { useState } from 'react'
import Layout from '../Layout/Layout'
import { Button, Table ,Modal,Input} from 'antd';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import useAxiosPrivate from '../../CustomHooks/useAxiosPrivate';
import { apiRequest } from '../../api/api.services';


const Category = () => {
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation();
  const [categoryList,setCategoryList] = useState([])
  const [paginationOption,setPaginationOption] = useState({
    current: 1,
    pageSize: 4,
    showSizeChanger: true,
    total: 100
  })

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

const columns = [
  {
    title: 'S.N.',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Action',
    key: 'operation',
    align: 'center',
    render: (text,record)=> {
      return (
        <div className='category-action'>
          <Button>View Menu</Button>
          <Button onClick={showModal}>Update</Button>
        </div>
      )
    }
  },
];


    // api calls
    let { isError } = useQuery(
      ["get-category"],
      () => {
        return apiRequest(axiosPrivate, {
          url: `/category/get-category?page=1&pageSize=4&sortBy=asc`,
        });
      },
      {
        onSuccess: (resp) => {
          let resData = resp?.data;
          setCategoryList(resData.categoryList)
          console.log("The data",resData)
        },
        onError: (e) => {
          console.log("the error",e)
        },
      }
    );
    const handlePaginationChange = (pagination)=> {
      console.log("The pagination i got",pagination)
      setPaginationOption(pagination)
      
    }

  return (
   <Layout>
     <div className='dashboard_container'>
      
     <div className='text-dash'>
      <div className='category-heading'>Category</div>
      <div className="breadcrumb">
        <span><Link to='/'>Home</Link></span> / <span className={`${location.pathname === '/category' && 'path-active'}`}> Category</span>
      </div>

      <div className='category-table'>
      <Table dataSource={categoryList} columns={columns} pagination= {paginationOption} onChange={handlePaginationChange} />

      </div>

        </div>
      
      </div>

      <Modal title="Update Category" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <div>
            <p><label htmlFor="">Name</label></p>
            <p style={{marginTop: "5px"}}><Input type="text" placeholder='Name' /></p>
          </div>
          <div style={{marginTop: "10px"}}>
            <p><label htmlFor="">Description</label></p>
            <p style={{marginTop: "5px"}}><Input type="text" placeholder='Description' /></p>
          </div>
        </div>
      </Modal>
   </Layout>
  )
}

export default Category