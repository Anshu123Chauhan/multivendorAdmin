// StoreDetailPopup.js
import React from "react";

function StoreDetailPopup({ storeData, onClose }) {
  return (
    <>
      <div className="storeViewOverlay"></div>
      <div className="storeViewData">
        <h2>Store Details</h2>
        <p>Store Name: {storeData.storename}</p>
        <p>Store Code: {storeData.storecode}</p>
        <p>Store Manager Name: {storeData.managername}</p>
        <p>Store Phone: {storeData.store_phone}</p>
        <p>Store Address: {storeData.Address}</p>
        <button className="btn btn-danger" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
}

export default StoreDetailPopup;
