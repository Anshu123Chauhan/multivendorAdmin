import React, { useState } from "react";
import Layout, { Container } from "../components/layout";
import { useUser } from "../config/userProvider.js";

const Account = () => {
  const { userData } = useUser();
  const [activeAccount, setActiveAccount] = useState("profile");
  
  return (
    <Layout>
      <Container>
        <div className="font-semibold text-xl py-1 px-4">Account Settings</div>
        <div className=" flex md:flex-row flex-col gap-2 w-full md:h-[95%] p-2 rounded-xl h-full">
          <div className="md:w-1/6 w-full md:h-full flex  md:flex-col justify-start items-start gap-2 bg-white border rounded-lg  p-2">
            <button
              style={{ borderWidth: 1 }}
              onClick={() => setActiveAccount("profile")}
              className={` border-zinc-100  text-start capitalize p-2 rounded-md w-full ${
                activeAccount === "profile"
                  ? "bg-black text-white"
                  : "bg-zinc-50"
              }  `}
            >
              profile
            </button>
            <button
              style={{ borderWidth: 1 }}
              onClick={() => setActiveAccount("setting")}
              className={` border-zinc-100  text-start capitalize p-2 rounded-md w-full ${
                activeAccount === "setting"
                  ? "bg-black text-white"
                  : "bg-zinc-50"
              }  `}
            >
              settings
            </button>
          </div>
          <div className="md:w-5/6 w-full bg-white border rounded-lg h-full p-6 font-semibold  gap-5 overflow-y-scroll">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-black rounded-full text-white flex justify-center items-center font-semibold text-2xl">
                {userData?.name[0]}
              </div>
              <div>
                <div className="text-base md:text-2xl">{userData?.name}</div>
                <div className="text-zinc-400">Type: {userData?.userType}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <div className="text-base md:text-2xl font-bold">Personal</div>
              <div className="flex items-center gap-12 mx-2 flex-wrap">
                <TextContainer label="phone number">
                  {userData?.phone}
                </TextContainer>
                <TextContainer label="email">{userData?.email}</TextContainer>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <div className="text-base md:text-2xl font-bold">Store</div>
              <div className="flex items-center gap-12 mx-2 flex-wrap">
                <TextContainer label="Store name">
                  {userData?.storeName}
                </TextContainer>
                <TextContainer label="Store code">
                  {userData?.storeCode}
                </TextContainer>
                <TextContainer label="Store address">
                  {userData?.storeAddress}
                </TextContainer>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <div className="text-2xl font-bold">permission</div>
              <div className="flex items-center gap-12 mx-2 flex-wrap">
                <TextContainer label="role">
                  {userData?.permission?.role}
                </TextContainer>
                <TextContainer label="orders">
                  {userData?.permission?.orders === true ? "true" : "false"}
                </TextContainer>
                <TextContainer label="products">
                  {userData?.permission?.products === true ? "true" : "false"}
                </TextContainer>
                <TextContainer label="reports">
                  {userData?.permission?.reports === true ? "true" : "false"}
                </TextContainer>

                <TextContainer label="settings">
                  {userData?.permission?.settings === true ? "true" : "false"}
                </TextContainer>
                <TextContainer label="stores">
                  {userData?.permission?.stores === true ? "true" : "false"}
                </TextContainer>
                <TextContainer label="users">
                  {userData?.permission?.users === true ? "true" : "false"}
                </TextContainer>
              </div>
            </div>
          </div>
        </div>

        <div>
          <TextContainer label="name">{userData?.name}</TextContainer>
        </div>
      </Container>
    </Layout>
  );
};

export default Account;

const TextContainer = ({ label, children }) => (
  <div className="capitalize font-semibold">
    <div className="text-sm font-semibold text-zinc-400 ">{label}</div>
    <div>{children}</div>
  </div>
);
