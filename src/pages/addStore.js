import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import Layout, { Container } from "../components/layout";
import axios from "axios"; // Import axios
import { useUser } from "../config/userProvider";
import { IoMdArrowRoundBack } from "react-icons/io";
import BackHeader from "../components/backHeader";
import { BlackButton } from "../components/buttonContainer";
import Input from "../components/inputContainer";
import { apiurl } from "../config/config";
import Card from "../components/card";
import { IoAdd } from "react-icons/io5";

const AddStore = () => {
  const { userData } = useUser();
  let vendorObjId = userData?.vendorDetails?.vendorObjId;
  const [showPopUp, setShowPopUp] = useState("");
  const [formdata, setFormdata] = useState({
    storeName: "",
    storeCode: "",
    storeManagerName: "",
    storePhone: "",
    storeAddress: {
      address: "",
      city: "",
      province: "",
      zip: "",
      country: "",
      province_code: "",
      country_code: "",
    },
    manager: {},
    staff: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = "your-auth-token";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formdata.storeAddress) {
      setFormdata({
        ...formdata,
        storeAddress: { ...formdata.storeAddress, [name]: value },
      });
    } else {
      setFormdata({ ...formdata, [name]: value });
    }
    setError("");
  };

  const handleBack = () => {
    navigate("/stores");
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formdata.storeName || !formdata.storeCode || !formdata.storePhone) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    let data = JSON.stringify({
      vendorObjId: vendorObjId,
      storeCode: formdata.storeCode,
      storeName: formdata.storeName,
      storeEmail: "store@example.com",
      storePhone: formdata.storePhone,
      storeAddress: {
        address: formdata.storeAddress.address,
        city: formdata.storeAddress.city,
        province: formdata.storeAddress.province,
        zip: formdata.storeAddress.zip,
        country: formdata.storeAddress.country,
        province_code: formdata.storeAddress.province_code,
        country_code: formdata.storeAddress.country_code,
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiurl}/admin/v1/store/create`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      if (response?.data?.success) {
        navigate("/stores");
      } else {
        setError("Failed to add store. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while adding the store. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [users, setUsers] = useState([]);

  const fetchUserData = async () => {
    setLoading(true);
    let payload = JSON.stringify({
      vendorObjId: vendorObjId,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiurl}/admin/v1/user/get`,
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Customer Data:", response.data.data);
        // setAppData(response.data.data);
        // setLoading(false);
        setUsers(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [selectedManager, setSelectedManager] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);

  const ManagerSubmitHandler = () => {
    // if (selectedManager !== "") {
    const manager = users.find((item) => item.id === selectedManager);
    setFormdata((prev) => ({ ...prev, manager }));
    setShowPopUp("");
    // }
  };

  const StaffSubmitHandler = () => {
    // if (!selectedStaff.length > 0) {
    const staff = users.filter((item) => selectedStaff.includes(item.id));
    setFormdata((prev) => ({ ...prev, staff }));
    setShowPopUp("");
    // }
  };

  console.log("formdata", formdata);
  return (
    <Layout>
      <Container>
        <div className="h-full w-full mx-auto">
          <div className="h-[100%] w-[100%] flex flex-col  overflow-auto text-sm md:text-base p-4 ">
            <BackHeader backButton={true} link="/stores" title="Create Store" />

            <div className="mt-10 flex  justify-between flex-col md:flex-row gap-3 md:gap-5">
              <Input.normal
                label="Store Name"
                name="storeName"
                value={formdata.storeName}
                placeholder="Enter Store Name"
                onChange={handleInputChange}
              />
              <Input.normal
                label="Store Code"
                name="storeCode"
                value={formdata.storeCode}
                placeholder="Enter Store Code"
                onChange={handleInputChange}
              />
              {/* <Input.normal
                label="Store Manager Name"
                name="storeManagerName"
                value={formdata.storeManagerName}
                placeholder="Enter Store Manager Name"
                onChange={handleInputChange}
              /> */}
              <Input.normal
                label=" Store Phone No."
                name="storePhone"
                value={formdata.storePhone}
                placeholder="Enter Store Phone No."
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full mt-5 md:mt-10 shadow rounded-xl border bg-white p-3 md:p-5 border-r text-sm md:text-base">
              <p className="text-slate-500 font-semibold text-sm md:text-lg">
                Store Address:
              </p>
              <div className="md:p-5 p-3 flex flex-col gap-3">
                <div className="mt-2 flex  justify-between flex-col md:flex-row gap-3 md:gap-5">
                  <Input.normal
                    label="Enter City"
                    name="city"
                    value={formdata.storeAddress.city}
                    placeholder="Enter City"
                    onChange={handleInputChange}
                  />
                  <Input.normal
                    label="Enter Province"
                    name="province"
                    value={formdata.storeAddress.province}
                    placeholder="Enter Province"
                    onChange={handleInputChange}
                  />
                  <Input.normal
                    label="Enter ZIP"
                    name="zip"
                    value={formdata.storeAddress.zip}
                    placeholder="Enter ZIP"
                    onChange={handleInputChange}
                  />
                </div>
                <Input.textArea
                  label="Enter Address"
                  name="address"
                  rows="5"
                  value={formdata.storeAddress.address}
                  placeholder="Enter Address"
                  onChange={handleInputChange}
                />
                <div className="mt-2 flex  justify-between flex-col md:flex-row gap-3 md:gap-5">
                  <Input.normal
                    label="Enter Country"
                    name="country"
                    value={formdata.storeAddress.country}
                    placeholder="Enter Country"
                    onChange={handleInputChange}
                  />
                  <Input.normal
                    label="Enter Province Code"
                    name="province_code"
                    value={formdata.storeAddress.province_code}
                    placeholder="Enter Province Code"
                    onChange={handleInputChange}
                  />
                  <Input.normal
                    label="Enter Country Code"
                    name="country_code"
                    value={formdata.storeAddress.country_code}
                    placeholder="Enter Country Code"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start  gap-3   ">
              <ShadowContainer
                title="Assign Manager"
                onClick={() => setShowPopUp("manager")}
              >
                {formdata?.manager &&
                  Object.keys(formdata.manager).length > 0 && (
                    <div className="flex flex-col shadow w-full rounded p-2">
                      <span>{formdata.manager.name}</span>
                      <span>{formdata.manager.email}</span>
                      <span>{formdata.manager.phone}</span>
                      <span>{formdata.manager.status}</span>
                      <span>{formdata.manager.userType}</span>
                    </div>
                  )}
              </ShadowContainer>
              <ShadowContainer
                title="Add Staff"
                onClick={() => setShowPopUp("staff")}
              >
                {formdata.staff.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {formdata.staff.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col shadow w-full rounded p-2"
                      >
                        <span>{item.name}</span>
                        <span>{item.email}</span>
                        <span>{item.phone}</span>
                        <span>{item.status}</span>
                        <span>{item.userType}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ShadowContainer>
            </div>

            <div className="mt-5 md:mt-10 ">
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="text-center ">
                <BlackButton
                  loading={loading}
                  handleSubmit={handleSubmit}
                  loadingTitle="Adding..."
                  title="Add Store"
                />
              </div>
            </div>
          </div>
        </div>

        {showPopUp === "manager" ? (
          <Card.AddPopUp
            removePopUp={() => setShowPopUp("")}
            Background="bg-none"
            width="md:w-auto"
          >
            <ShadowContainer
              ContainerClassName="mt-0"
              isButton={false}
              title="Assign Manager"
              height="h-full"
              margin="m-0"
            >
              <CheckboxTable
                tableBody={users}
                tableHead={["Manager Name", "Email", "Phone", "userType"]}
                buttonTitle="Add Manager"
                selected={selectedManager}
                setSelected={setSelectedManager}
                setShowPopUp={setShowPopUp}
                handleSubmit={ManagerSubmitHandler}
                // disable={selectedManager === ""}
              />
            </ShadowContainer>
          </Card.AddPopUp>
        ) : showPopUp === "staff" ? (
          <Card.AddPopUp
            removePopUp={() => setShowPopUp("")}
            Background="bg-none"
            width="md:w-auto"
          >
            <ShadowContainer
              ContainerClassName="mt-0"
              isButton={false}
              title="Add Staff Member"
              height="h-full"
              margin="m-0"
            >
              <CheckboxTable
                tableBody={users}
                tableHead={["Manager Name", "Email", "Phone", "userType"]}
                selected={selectedStaff}
                setSelected={setSelectedStaff}
                setShowPopUp={setShowPopUp}
                isStaff={true}
                buttonTitle="Add Staff"
                handleSubmit={StaffSubmitHandler}
                disable={selectedStaff.length === 0}
              />
            </ShadowContainer>
          </Card.AddPopUp>
        ) : null}
      </Container>
    </Layout>
  );
};

export default AddStore;

export const ShadowContainer = ({
  children,
  title,
  loading,
  onClick,
  isButton,
  height,
  margin,
}) => (
  <div
    className={`w-full  shadow rounded-xl border bg-white p-3 md:p-5 border-r text-sm md:text-base ${
      height ? height : "h-auto"
    } ${margin ? margin : "mt-5 md:mt-10"}  `}
  >
    <div className="flex justify-between items-center">
      <p className="text-slate-500 font-semibold text-sm md:text-lg">{title}</p>
      {isButton === false ? null : (
        <BlackButton
          loading={loading}
          handleSubmit={onClick}
          // loadingTitle="Adding..."
          title={
            <span>
              <IoAdd />
            </span>
          }
        />
      )}
    </div>
    {children && (
      <div className={`p-6 ${height ? height : ""} overflow-auto`}>
        {children}
      </div>
    )}
  </div>
);

export const CheckboxTable = ({
  tableHead,
  tableBody,
  selected,
  setSelected,
  setShowPopUp,
  buttonTitle,
  isStaff,
  handleSubmit,
  disable,
}) => {
  const StaffHandler = (item) => {
    const isSelected = selected.includes(item?.id);
    console.log("StaffHandler Filter", isSelected);
    if (isSelected) {
      const updatedSelection = selected.filter((id) => id !== item?.id);
      setSelected(updatedSelection);
      console.log("StaffHandler updatedSelection", updatedSelection);
    } else {
      setSelected((prev) => [...prev, item?.id]);
    }
  };
  return (
    <div className="relative overflow-x-auto h-full sm:rounded-lg">
      <div className="flex justify-between gap-2 items-center mb-3 w-full">
        <div className=" bg-white ">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative ">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2  ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>

        <BlackButton
          disable={disable}
          handleSubmit={handleSubmit}
          loadingTitle="Adding..."
          title={buttonTitle}
        />
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
          <tr>
            <th></th>

            {tableHead &&
              tableHead.map((item, index) => (
                <th scope="col" className="px-6 py-3" key={index}>
                  {item}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableBody &&
            tableBody.map((item, index) => (
              <tr key={index} className={`bg-white border-b hover:bg-gray-50`}>
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      checked={
                        isStaff
                          ? selected.includes(item?.id)
                          : selected === item?.id
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      onClick={(e) =>
                        isStaff
                          ? StaffHandler(item)
                          : setSelected(selected === item?.id ? "" : item?.id)
                      }
                    />
                    {/* <label
                      htmlFor={`checkbox-table-search-${index}`}
                      className="sr-only"
                    >
                      checkbox
                    </label> */}
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {item?.name}
                </th>
                <td className="px-6 py-4">{item?.email}</td>
                <td className="px-6 py-4">{item?.phone}</td>
                <td className="px-6 py-4">{item?.userType}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
