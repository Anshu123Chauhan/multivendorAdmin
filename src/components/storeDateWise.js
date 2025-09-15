/* eslint-disable jsx-a11y/scope */
import React, { useState, useEffect } from "react";
import Layout from "./dashboardContainer";
import axios from "axios";
import { ExportCSV } from "./exportCsv";
import Advanceloader from "../advanceloader.gif";

function StoreDateWise() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [buttonShow, setButtonShow] = useState(false);
  const [storeData, setStoreData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTableData, setShowTableData] = useState(false);
  const [Loading, setLoading] = useState(false);

  // ===================start date code=======================
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);

    checkFormValidity(event.target.value, endDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    checkFormValidity(startDate, event.target.value);
  };

  const checkFormValidity = (start, end) => {
    if (start && end) {
      setButtonShow(true);
    } else {
      setButtonShow(false);
    }
  };
  // ====================End date code===========================

  // ====================Start Pagination Code===================
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = storeData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(storeData.length / recordsPerPage);
  function prepage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCpage(id) {
    setCurrentPage(id);
  }

  function nextpage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
  const buttonsToShow = 10;
  const startPage = Math.max(1, currentPage - Math.floor(buttonsToShow / 2));
  const endPage = Math.min(npage, startPage + buttonsToShow - 1);
  const numbers = [...Array(endPage - startPage + 1).keys()].map(
    (index) => startPage + index
  );
  // ====================End Pagination Code===================

  // ====================Start api get Code===================
  const handleButtonClick = () => {
    getByData();
    setShowTableData(true);
  };

  const getByData = async () => {
    setLoading(true);
    const requestBody = {
      startDate: startDate,
      endDate: endDate,
    };
    axios
      .post(
        "https://blackberry-9ab311620e64.herokuapp.com/analytic/createlead",
        requestBody
      )
      .then((response) => {
        setStoreData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    // getByData()
  }, []);
  // ====================End api get Code===================

  return (
    <Layout>
      <>
        {Loading === true ? (
          <div className="d-flex justify-content-center">
            <img src={Advanceloader} />
          </div>
        ) : (
          <div className="container my-3">
            <h1 className="text-center">Store List Date Wise</h1>
            <div className="row position-relative">
              <div className="d-flex justify-content-between align-items-center p-3 mx-auto">
                {/* <div className="col-4">
                <h5>Start Date : </h5>
                <DatePicker
                  selected={startDate}
                  dateFormat="dd-MM-yyyy"
                  onChange={handleStartDateChange}
                  className="start_date_input"
                  minDate={minDate}
                />
              </div>
              <div className="col-4">
                <h5>End Date : </h5>
                <DatePicker
                  className="end_date_input "
                  selected={endDate}
                  onChange={handleEndDateChange}
                  placeholderText="End Date"
                  dateFormat="dd-MM-yyyy"
                  maxDate={maxDate}
                  minDate={minDate}
                />
              </div> */}
                <div className="col-3">
                  <label htmlFor="start-date"> Start Date : </label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Select a date"
                    id="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className="col-3">
                  <label htmlFor="end-date"> End Date : </label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={handleEndDateChange}
                    id="end-date"
                  />
                </div>
                <div className="col-4">
                  {buttonShow ? (
                    <button
                      className="btn dateBttn"
                      onClick={handleButtonClick}
                    >
                      Submit
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            {/* =========================bottom table show data ============== */}
            {showTableData && (
              <div className="p-4 mt-0 mb-5 border rounded w-100 d-flex justify-content-center flex-column mx-auto">
                <table class="table table-bordered">
                  <thead>
                    <tr className="text-center">
                      <th className="text-bold">#</th>
                      <th>Store Name</th>
                      <th>Store Code</th>
                      <th>No Of Download PDF</th>
                      <th>Store Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records &&
                      records?.map((item, index) => {
                        return (
                          <tr key={index} className="text-center">
                            <td scope="row">{index + 1}</td>
                            <td scope="row">{item?.storeName}</td>
                            <td scope="row">{item?.storeCode}</td>
                            <td scope="row">{item?.no_of_download}</td>
                            <td scope="row">{item?.storeAddress}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {/* ====================Pagination button============================ */}
                <div className="neo_btn_container">
                  <button className="product_neo_btn" onClick={prepage}>
                    Previous
                  </button>
                  {numbers.map((n, i) => {
                    return (
                      <div
                        className={`page-item ${
                          currentPage === n ? "active" : " "
                        }`}
                        key={i}
                      >
                        <button
                          className={`product_neo_btn ${
                            currentPage === n ? "active-page-button" : ""
                          }`}
                          onClick={() => changeCpage(n)}
                        >
                          {n}
                        </button>
                      </div>
                    );
                  })}
                  <button className="product_neo_btn" onClick={nextpage}>
                    Next
                  </button>
                </div>
                {/*=============================End Pagination button=======================  */}
                <div className="d-flex justify-content-end">
                  <ExportCSV csvData={storeData} fileName={"Excel Exports"} />
                  {/* <button className="btn btn-primary">Download CSV</button> */}
                </div>
              </div>
            )}
          </div>
        )}
      </>
    </Layout>
  );
}

export default StoreDateWise;
