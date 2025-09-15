import React from "react";

const usePagination = ({ recordsPerPage, currentPage, buttonsToShow }) => {
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredProducts.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredProducts.length / recordsPerPage);

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

  // const buttonsToShow = 10;
  const startPage = Math.max(1, currentPage - Math.floor(buttonsToShow / 2));
  const endPage = Math.min(npage, startPage + buttonsToShow - 1);
  const pagiNumber = [...Array(endPage - startPage + 1).keys()].map(
    (index) => startPage + index
  );

  return { records, pagiNumber, prepage, nextpage, changeCpage, currentPg };
};

export default usePagination;
