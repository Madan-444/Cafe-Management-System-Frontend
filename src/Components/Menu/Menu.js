import React, { useState } from 'react'
import Layout from '../Layout/Layout'
import { useLocation } from 'react-router';
import { Button, Form, Modal, Table, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import useAxiosPrivate from '../../CustomHooks/useAxiosPrivate';
import { apiRequest } from '../../api/api.services';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

function Menu() {
    const location = useLocation();
    const [updateData, setUpdateData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const axiosPrivate = useAxiosPrivate()
    const [categoryList, setCategoryList] = useState([])
    const [menuList, setMenuList] = useState([])
    const queryClient = useQueryClient()
    const [paginationOption, setPaginationOption] = useState({
        total: 0,
        pageSize: 4,
        current: 1,
        showSizeChanger: true,
    
      })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const addMenu = (data) => {
        addMenuMutate(data)
    }


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
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: "center",
      key: 'action',
      render: (_, data) => {
        return (
          <div className='category-buttons'>
            <Button >Edit</Button>
            <Button >Delete</Button>
          </div>
        )
      }
    },
  ];


    const {
        mutate: addMenuMutate,
        isLoading,
        data,
      } = useMutation(
        (data) =>
          apiRequest(axiosPrivate, {
            url: `/product/add`,
            method: "post",
            data,
          }),
        {
          onSuccess: (res) => {
            toast("Menu Added Sucessfully")
            closeModal();
            queryClient.invalidateQueries('get-menu')
          },
           onError: (e) => {
            console.log("the errr",e)
          },
        }
      );

    let { isError } = useQuery(
        ["get-category"],
        () => {
            return apiRequest(axiosPrivate, {
                url: `/category/get-category?page=1&pageSize=20&sortBy=desc`,
            });
        },
        {
            onSuccess: (res) => {
                setCategoryList(res.data?.categoryList)

            },
            onError: (e) => {
                if (e) {
                    toast("Error on fetching category list")
                }
            },
        }
    );
    let { isError:menuError } = useQuery(
        ["get-menu",paginationOption],
        () => {
            return apiRequest(axiosPrivate, {
                url: `/product/get?page=${paginationOption.current}&pageSize=${paginationOption.pageSize}&sortBy=desc`,
            });
        },
        {
            onSuccess: (res) => {
                setPaginationOption({
                    ...paginationOption,
                    total: res.data?.totalData
                  })
                setMenuList(res.data?.productList)

            },
            onError: (e) => {
                if (e) {
                    toast("Error on fetching category list")
                }
            },
        }
    );

    const handleTableChange = (pagination) => {
        setPaginationOption(prevPagination => ({
          ...prevPagination,
          ...pagination
        }));
        queryClient.invalidateQueries("get-menu");
      }
    const closeModal = () => {
        setIsModalOpen(false)
    }
    return (
        <Layout>
            <div className='dashboard_container'>

                <div className='text-dash'>
                    <div className='category-heading'>Menu List</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="breadcrumb">
                            <span><Link to='/'>Home</Link></span> / <span className={`${location.pathname === '/menu' && 'path-active'}`}> Menu</span>
                        </div>
                        <div style={{ marginRight: "20px" }}>
                            <Button onClick={() => setIsModalOpen(true)} type='primary'>Add Menu</Button>
                        </div>
                    </div>

                    <div className='category-table'>
                        <Table dataSource={menuList} columns={columns} pagination={paginationOption} onChange={handleTableChange} />

                    </div>

                </div>
            </div>
            <Modal title={updateData ? "Update Category" : "Add Category"} open={isModalOpen} footer="" onCancel={closeModal} >
                <Form onFinish={handleSubmit(addMenu)}>

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
                    <Form.Item label="Category">
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select {...field} placeholder="Name" style={{ marginTop: "10px" }} >
                                    {categoryList.map((item) => {
                                        return (
                                            <Select.Option value={item.id}>{item.name}</Select.Option>
                                        )
                                    })}
                                </Select>
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
                    <Form.Item label="Price">
                        <Controller
                            name="price"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input {...field} placeholder="Price" style={{ marginTop: "10px" }} />
                            )}
                        />
                    </Form.Item>


                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                        <Button onClick={closeModal}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </div>
                </Form>

            </Modal>

        </Layout>
    )
}

export default Menu