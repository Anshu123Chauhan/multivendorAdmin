import React from 'react'

const page = ({ label }) => {
  return (
    <div>
      {" "}
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 max-w-lg bg-gray-800 rounded-lg shadow-lg">
          <>
            <h1 className="text-4xl font-bold text-white mb-4">
              Data Not Found
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              We couldn't find any information for the {label}.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300 transition">
                Go Back
              </button>
              <button className="border border-white text-white px-6 py-2 rounded hover:bg-gray-700 transition">
                Contact Support
              </button>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};
const container = ({ label }) => {
  return (
    <p className="text-lg text-gray-400 mb-6 text-center my-5">
      We couldn't find any information for the {label}.
    </p>
  );
};

const DataNotFound = { page, container };
export default DataNotFound