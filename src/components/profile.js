import React from "react";
import Layout from "./layout";

const Profile = () => {
  return (
    <Layout>
      <>
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 md:p-10">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 md:p-10">
            <div className="flex flex-col items-center">
              <img
                src="https://i1.wp.com/static.vecteezy.com/system/resources/previews/026/966/960/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg?;ssl=1"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <form className="mt-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    User Name
                  </label>
                  <input
                    type="text"
                    value="Mayank"
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    User Type
                  </label>
                  <input
                    type="text"
                    value="Admin"
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value="shubham@ens.enterprise"
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  value="9876543215"
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Store Address
                </label>
                <input
                  type="text"
                  value="ENS, B16, Sector-63, Noida, UP, INDIA"
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col md:flex-row md:space-x-6 mt-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value="Mayank Test Store"
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Store Code
                  </label>
                  <input
                    type="text"
                    value="MV123"
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* <div className="flex flex-col md:flex-row md:space-x-6 mt-4">
                        <div className="w-full md:w-1/2">
                            <label className="block text-sm font-medium text-gray-700">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                value="201301"
                                readOnly
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                            />
                        </div>
                        <div className="w-full md:w-1/2 mt-4 md:mt-0">
                            <label className="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <input
                                type="text"
                                value="India"
                                readOnly
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value="123456"
                            readOnly
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                        />
                    </div> */}
              {/* <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600"
                        >
                            Edit
                        </button>
                    </div> */}
            </form>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default Profile;
