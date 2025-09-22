import React from "react";
import Layout, { Container } from "../components/layout";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <Layout>
      <Container className="flex flex-col justify-center items-center h-screen">
        <div className="font-bold drop-shadow text-4xl">
          Welcome to the{" "}
          <span className=" text-orange-600">
            {" "}
            ENS Marketplace Dashboard
          </span>
        </div>
        <Link to="/">
          <div className="bg-orange-600 cursor-pointer text-white p-2 px-4 rounded-lg mt-4">
            Back to Login
          </div>
        </Link>
      </Container>
    </Layout>
  );
};

export default Welcome;
