import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import Input from "../components/inputContainer";
import Card from "../components/card";
import { useUser } from "../config/userProvider";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import { AiOutlineEye } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useStepContext } from "@mui/material";
import { toast } from "react-toastify";

const Filter = () => {
  const [filters, setFilters] = useState([]);
  const [allFilters, setAllFilters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newFilter, setNewFilter] = useState({
    name: '',
    status: 'Active',
    filterType: 'Filter'
  });
  const [loading, setloading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/filter/getFilter`, {
        headers: {
          "ngrok-skip-browser-warning": "69420"
        }
      });
      const data = await response.data;
      if (data.success) {
        setFilters(response?.data?.data);
        setAllFilters(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
    finally {
      setloading(false);
    }
  };

  const toggleStatus = async (filter) => {
    const { name, id } = filter;
    const updatedStatus = filter.status === 'Active' ? 'Inactive' : 'Active';

    try {
      const response = await axios.put(`${apiurl}/admin/filter/updateFilter/${id}`, {
        name: name,
        status: updatedStatus
      });

      const data = await response.data;
      if (data.success) {
        fetchFilters();
      }
    } catch (error) {
      console.error('Error updating filter status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFilter({ ...newFilter, [name]: value });
  };

  console.log("New Filter", newFilter);

  const handleAddFilter = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      let url;
      let method;
      if (editToggle) {
        url = `${apiurl}/admin/filter/updateFilter/${editId}`;
        method = "PUT"
      }
      else {
        url = `${apiurl}/admin/filter/createFilter`
        method = "POST"
      }

      const response = await axios(
        {
          method: method,
          url: url,
          data: newFilter
        }
      );

      const data = await response.data;
      if (data.success) {
        fetchFilters();
        setEditToggle(false)
        setNewFilter({ name: '', status: 'Active' });
        setIsModalOpen(false);
        toast.success(`${editToggle ? "Filter updated successfully":"Filter created successfully"}`)
      }

    } catch (error) {
      toast.error(error?.message);
      console.error('Error creating filter:', error);
    }
    finally {
      setloading(false);
    }
  };

  const handleEditFilter = (filter) => {
    console.log("filter", filter);
    setIsModalOpen(true);
    setEditToggle(true);

    const selectedFilter = filters.filter(item => item.id === filter.id);
    console.log("selectedFilter", selectedFilter);
    setEditId(selectedFilter[0]?.id);
    setNewFilter({
      name: selectedFilter[0]?.name,
      status: selectedFilter[0]?.status,
      filterType : selectedFilter[0]?.filterType
    });
  }

  const handleDeleteFilter = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/filter/deleteFilter/${id}`);

      const data = await response.data;

      if (data.success) {
        fetchFilters();
      }
    }
    catch (error) {
      console.error('Error updating filter:', error);
    }
  }

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setFilters(allFilters);
      return;
    }

    const updatedFilter = filters.filter(item =>
      item.name.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setFilters(updatedFilter);
  };

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Filter Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="Filters"
              rightSide={
                <div className="flex gap-3 w-[500px]">

                  <button className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000] text-[#fff] w-[150px] p-2 rounded-md" onClick={() => setIsModalOpen(true)}>
                    Add Filter
                  </button>


                  <Input.search
                    placeholder="Search Your Filter "
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              }
            />
            <div>


              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {[
                        "SN.",
                        "Filter Name",
                        "Status",
                        "Action"
                      ].map((item, index) => (
                        <th key={index} scope="col" className="px-6 py-3">
                          {item}
                        </th>
                      ))}
                    </tr>

                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {filters?.map((filter, index) => (
                      <tr key={filter?.id} className="border-t">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{filter?.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              onClick={() => toggleStatus(filter)}
                              className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${filter.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${filter.status === 'Active' ? 'translate-x-4' : ''
                                  }`}
                              ></div>
                            </div>
                            <span className="text-xs">{filter?.status}</span>
                          </div>
                        </td>
                        <td>
                          <span className="flex gap-1 cursor-pointer">
                            <CiEdit
                              className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                              onClick={() => handleEditFilter(filter)} />
                            <MdDeleteForever
                              className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                              onClick={() => handleDeleteFilter(filter?.id)} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                    <button
                      onClick={() => {
                        setIsModalOpen(false)
                        setEditToggle(false);
                        setNewFilter({
                          name: '',
                          status: 'Active'
                        });
                      }
                      }
                      className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ×
                    </button>
                    <h2 className="text-lg font-semibold mb-4">{editToggle ? 'Edit Filter' : 'Add Filter'}</h2>
                    <form onSubmit={handleAddFilter} className="space-y-4">
                      <div>
                        <label className="block mb-1 text-gray-700 font-medium">Filter Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newFilter.name}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded px-3 py-2 outline-none"
                        />
                      </div>

                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <input
                            id="filter"
                            type="radio"
                            name="filterType"
                            value={'Filter'}
                            checked={newFilter.filterType === 'Filter'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border border-gray-300 appearance-none rounded-full checked:bg-blue-600 checked:border-transparent"
                          />
                          <label htmlFor="filter" className="text-sm font-medium text-gray-700">Filter By</label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            id="sort"
                            type="radio"
                            name="filterType"
                            value={'Sort'}
                            checked={newFilter.filterType === 'Sort'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border border-gray-300 appearance-none rounded-full checked:bg-blue-600 checked:border-transparent"
                          />
                          <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort By</label>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-700 font-medium">Status</label>
                        <select
                          name="status"
                          value={newFilter.status}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2 outline-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 font-semibold"
                      >
                        {
                          editToggle ? 'Update Filter' : 'Save Filter'
                        }
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default Filter;
