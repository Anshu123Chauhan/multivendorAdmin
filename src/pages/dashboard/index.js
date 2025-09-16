import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout";
import Layout from "../../components/dashboardContainer";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container dashboardContent">
        <div className="row m-1 mt-5 mt-md-5 m-md-5 d-flex justify-content-between flex-column flex-md-row">
          <Link
            to="/"
            className="text-decoration-none analyticTotalOrder cardShow text-dark"
          >
            <div className="analyticTotalOrderImg">
              <img
                className="totalorderImage"
                src="/dashboardLogo/profile.png"
                alt=""
              />
            </div>
            <div className="analyticTotalOrderText">
              <h2 className="analyticTotalOrderHead">Profile</h2>
            </div>
          </Link>

          <Link
            to="/createcatalog"
            className="text-decoration-none analyticTotalOrder cardShow text-dark"
          >
            <div className="analyticTotalOrderImg">
              <img
                className="totalorderImage"
                src="/dashboardLogo/catlog.png"
                alt=""
              />
            </div>
            <div className="analyticTotalOrderText">
              <h2 className="analyticTotalOrderHead">Catalog</h2>
            </div>
          </Link>

        
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
