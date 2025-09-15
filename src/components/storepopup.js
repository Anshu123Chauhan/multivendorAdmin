import React, { useState, useEffect } from "react";
import Loader from "../loader.svg";
import axios from "axios";
import Select from "react-select";
import StoreDetailPopup from "./storeDetailPopup";

function Storepopup({ isOpen, onClose }) {
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailPopupOpen, setDetailPopupOpen] = useState(false);
  const [selectedStoreData, setSelectedStoreData] = useState(null);

  const recordsPerPage = 8;

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  //   value filter karne ke liye small code
  const filteredData = storeData.filter(
    (item) =>
      item.storename.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.storecode.toLowerCase().includes(filterValue.toLowerCase())
  );
  // replace storeData to filteredData in pagination code
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
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
  const handleSearch = (event) => {
    setFilterValue(event.target.value);
  };
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const config = {
        method: "get",
        url: "https://blackberry-9ab311620e64.herokuapp.com/getstores",
      };

      axios
        .request(config)
        .then((response) => {
          console.log("response.data", response.data);
          setStoreData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <>
      {loading === true ? (
        <>
          <div className="loginOverlay"></div>
          <div className="loginloader">
            <img src={Loader} />
          </div>
        </>
      ) : null}
      <div className="storeListSection">
        <h1 className="text-center">Store List</h1>
        <button
          type="button"
          className="btn-close storeBtn mb-3"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="p-4 mt-0 mb-5 border rounded w-100 d-flex justify-content-center flex-column mx-auto">
        <div className="form-group has-search mb-3 w-50 d-flex justify-content-center m-auto">
          {/* <Select
            value={filterValue}
            onChange={(selectedOption) =>
              setFilterValue(selectedOption.value || "")
            }
            options={storeData.map((item) => ({
              value: item.managername,
              label: item.managername,
            }))}
            placeholder="Search by Store Code..."
          /> */}
          <input
            value={filterValue}
            onChange={handleSearch}
            className="form-control"
            type="text"
            placeholder="Search Store name and code"
          />
        </div>

        <table class="table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Store Name</th>
              <th>Store Code</th>
              <th>Store Manager Name</th>
              <th>Store Phone</th>
              <th>Store Address</th>
              <th>View Data</th>
            </tr>
          </thead>
          <tbody>
            {records &&
              records.map((item) => {
                return (
                  <tr>
                    <td scope="row">{item.id}</td>
                    <td scope="row">{item.storename}</td>
                    <td scope="row">{item.storecode}</td>
                    <td scope="row">{item.managername}</td>
                    <td scope="row">{item.store_phone}</td>
                    <td scope="row">{item.Address}</td>
                    <td scope="row">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedStoreData(item);
                          setDetailPopupOpen(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="neo_btn_container">
          <button className="product_neo_btn" onClick={prepage}>
            Previous
          </button>
          {numbers.map((n, i) => {
            return (
              <div
                className={`page-item ${currentPage === n ? "active" : " "}`}
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
      </div>

      {isDetailPopupOpen === true ? (
        <StoreDetailPopup
          storeData={selectedStoreData}
          onClose={() => setDetailPopupOpen(false)}
        />
      ) : null}
    </>
  );
}

export default Storepopup;
