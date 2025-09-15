import { useState, useEffect } from "react";

import Layout from "../components/layout";
import { useUser } from "../config/userProvider";
const UserProfile = () => {
  const [user, setUser] = useState();

  let { userData } = useUser();

  console.log("userData", userData);

  return (
    <Layout>
      <h2 className="text-center mt-5">User Profile Card</h2>
      <div className="card mt-4">
        {user && (
          <>
            <img
              className="w-25 mx-auto pt-2"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDy6RCP4XURksnhjmITnhHh3bA-m0thy_d3B-JDNM-KY1wNNnSQSL7ZIJxyvAAIKLTX4U&usqp=CAU"
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;
