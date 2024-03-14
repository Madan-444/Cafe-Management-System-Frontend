import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import { Button, Form, Input, Modal, Table } from 'antd';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAxiosPrivate from '../../CustomHooks/useAxiosPrivate';
import { apiRequest } from '../../api/api.services'; 
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';

const Category = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation();
  const [categoryList, setCategoryList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData,setDeleteData] = useState(null)
  const [paginationOption, setPaginationOption] = useState({
    total: 0,
    pageSize: 4,
    current: 1,
    showSizeChanger: true,

  })

  const [updateData, setUpdateData] = useState(null)

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
      dataIndex: 'action',
      align: "center",
      key: 'action',
      render: (_, data) => {
        return (
          <div className='category-buttons'>
            <Button onClick={() => {
              setUpdateData(data)
              reset(data)
              showModal();
            }}>Edit</Button>
            <Button onClick={()=> setDeleteData(data)}>Delete</Button>
          </div>
        )
      }
    },
  ];


  const updateCategory = (data) => {
    let tempData= {
      id: updateData.id,
      ...data
    }
    updateCategoryMutate(tempData)
  }


  const {
    mutate: addCategoryMutate,
    isLoading,
    data,
  } = useMutation(
    (data) =>
      apiRequest(axiosPrivate, {
        url: `/category/addCategory`,
        method: "post",
        data,
      }),
    {
      onSuccess: (res) => {
        toast("Category Added Sucessfully")
        closeModal();
        queryClient.invalidateQueries('get-category')
      },
       onError: (e) => {
        console.log("the errr",e)
      },
    }
  );
  const {
    mutate: updateCategoryMutate,

  } = useMutation(
    (data) =>
      apiRequest(axiosPrivate, {
        url: `/category/update`,
        method: "put",
        data,
      }),
    {
      onSuccess: (res) => {
        toast("Category Updated Sucessfully")
        closeModal();
        queryClient.invalidateQueries('get-category')
      },
       onError: (e) => {
        console.log("the errr",e)
      },
    }
  );
  const {
    mutate: deleteCategoryMutate,

  } = useMutation(
    () =>
      apiRequest(axiosPrivate, {
        url: `/category/delete/${deleteData.id}`,
        method: "delete",

      }),
    {
      onSuccess: (res) => {
        toast("Category Deleted Sucessfully")
        closeDeleteModal();
        queryClient.invalidateQueries('get-category')
      },
       onError: (e) => {
        console.log("the errr",e)
      },
    }
  );
  


  const handleTableChange = (pagination) => {
    setPaginationOption(prevPagination => ({
      ...prevPagination,
      ...pagination
    }));
    queryClient.invalidateQueries("get-category");
  }
  // api calls
  let { isError } = useQuery(
    ["get-category", paginationOption],
    () => {
      return apiRequest(axiosPrivate, {
        url: `/category/get-category?page=${paginationOption.current}&pageSize=${paginationOption.pageSize}&sortBy=desc`,
      });
    },
    {
      onSuccess: (res) => {
        setCategoryList(res.data?.categoryList)
        setPaginationOption({
          ...paginationOption,
          total: res.data?.totalData
        })
      },
      onError: (e) => {
        if (e) {
          toast("Error on fetching category list")
        }
      },
    }
  );

  const addCategory = (data) => {
    addCategoryMutate(data)
  }

  const handleDelete = ()=> {
    deleteCategoryMutate()
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setUpdateData(null)
    setIsModalOpen(false);
  };
  const closeDeleteModal = () => {
    setDeleteData(null)
  };
  return (
    <Layout>
      <div className='dashboard_container'>

        <div className='text-dash'>
          <div className='category-heading'>Category</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="breadcrumb">
              <span><Link to='/'>Home</Link></span> / <span className={`${location.pathname === '/category' && 'path-active'}`}> Category</span>
            </div>
            <div style={{ marginRight: "20px" }}>
              <Button onClick={() => {
                setUpdateData(null)
                showModal()
                reset({
                  name: "",
                  description: ""
                })
              }} type='primary'>Add Category</Button>
            </div>
          </div>

          <div className='category-table'>
            <Table dataSource={categoryList} columns={columns} pagination={paginationOption} onChange={handleTableChange} />

          </div>

        </div>

      </div>
      <Modal title={updateData ? "Update Category" : "Add Category"} open={isModalOpen} footer="" onCancel={closeModal} >
        <Form onFinish={handleSubmit(updateData? updateCategory: addCategory)}>

          <Form.Item label="Name">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder="Name" style={{ marginTop: "10px" }} />
              )}
            />
          </Form.Item>
          <Form.Item label="Description">
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder="Description" style={{ marginTop: "10px" }} />
              )}
            />
          </Form.Item>


          <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "15px" }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">Submit</Button>
          </div>
        </Form>

      </Modal>
      <Modal title="Delete Category" open={deleteData ? true : false} onCancel={closeDeleteModal} onOk={handleDelete} >
        <p style={{margin: "20px 0",textAlign: "center",fontSize: "24px"}}>Are you sure want to delete ??</p>
      </Modal>

    </Layout>
  )
}

export default Category