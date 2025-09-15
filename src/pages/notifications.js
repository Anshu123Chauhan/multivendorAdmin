import React from "react";
import Settinglayout from '../components/Settinglayout';
import { Link } from "react-router-dom";
import { useUser } from "../config/userProvider";

const Notifications = () => {
const {userData} = useUser()
    console.log(userData?.email)
    return (
        <Settinglayout>
            <div className="min-h-screen bg-gray-100 p-8">
                {/* Header Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                </div>
                <div className="bg-white shadow-md rounded-lg  mx-auto p-6">


                    {/* Sender Email Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-600">Sender email</h3>
                        <p className="text-sm text-gray-500 mb-3">
                            The email your store uses to send emails to your customers
                        </p>
                        <div className="flex items-center gap-4">
                            <input
                                type="email"
                                value={userData?.email}
                                readOnly
                                className="border border-gray-300 rounded-md py-2 px-4 w-full text-gray-700"
                            />
                            <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-md border text-sm">
                                Unverified
                            </span>
                        </div>
                        <button className="mt-3 text-sm text-blue-600 hover:underline">
                            Resend verification
                        </button>
                    </div>

                    {/* Notification Sections */}
                    <div className="space-y-4">
                        <Link to="/settings/notifications/customer">
                            <div className="flex items-center justify-between border border-gray-200 rounded-md p-4 hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">👤</div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Customer notifications</h4>
                                        <p className="text-sm text-gray-500">
                                            Notify customers about order and account events
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm cursor-pointer">
                                        &gt;
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <Link to='/settings/notifications/staff'>
                            <div className=" mt-4 flex items-center justify-between border border-gray-200 rounded-md p-4 hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">👥</div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Staff notifications</h4>
                                        <p className="text-sm text-gray-500">
                                            Notify staff members about new order events
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm cursor-pointer">
                                        &gt;
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <Link to='/notifications/fulfillment_request'>
                            <div className=" mt-4 flex items-center justify-between border border-gray-200 rounded-md p-4 hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">📦</div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Fulfillment request notification</h4>
                                        <p className="text-sm text-gray-500">
                                            Notify your fulfillment service provider when you mark an order as fulfilled
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm cursor-pointer">
                                        &gt;
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <Link to='/notifications/webhooks'>
                            <div className=" mt-4 flex items-center justify-between border border-gray-200 rounded-md p-4 hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">💻</div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Webhooks</h4>
                                        <p className="text-sm text-gray-500">
                                            Send XML or JSON notifications about store events to a URL
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm cursor-pointer">
                                        &gt;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Settinglayout>
    );
};

export default Notifications;
