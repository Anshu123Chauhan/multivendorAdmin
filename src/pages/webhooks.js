import React, { useState } from "react";
import Settinglayout from "../components/Settinglayout";
import { useNavigate } from "react-router-dom";

const Webhooks = () => {
    const navigate = useNavigate()
    const [webhookpop, Setwebhookpop] = useState(false)
    const [event, setEvent] = useState("Cart creation");
    const [format, setFormat] = useState("JSON");
    const [url, setUrl] = useState("");
    const [apiVersion, setApiVersion] = useState("unstable");

    const onClose = () =>{
        Setwebhookpop(false)
    }
    return (
        <Settinglayout>
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="mb-4">
                    <button
                        className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
                        onClick={() => navigate(-1)}
                    >
                        back
                    </button>
                </div>

                {/* Webhooks Card */}
                <div className="bg-white p-6 rounded-md shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Send XML or JSON notifications about store events to a URL</h2>

                    {/* Webhook Item */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-gray-800 font-medium mb-2">Customer creation</h3>
                        <div className="flex justify-between items-center text-sm text-gray-700 bg-gray-100 p-3 rounded-md">
                            <div>
                                <p className="font-mono text-gray-600">
                                    https://e3d6-180-151-16-39.ngrok-free.app/webhooks/create-customer
                                </p>
                                <p>• JSON</p>
                            </div>
                            <button className="text-gray-600 hover:text-gray-900">
                                <span className="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Create Webhook Button */}
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                        onClick={() => Setwebhookpop(true)}
                    >
                        + Create webhook
                    </button>

                    {/* Signing Key */}
                    <p className="text-gray-600 text-sm mt-6">
                        Your webhooks will be signed with{" "}
                        <span className="font-mono text-gray-900">
                            4059e857dc5e8ef987bfb4f2c2169d848dd14d5e406ba9014f21bc3227cdddd1
                        </span>
                    </p>
                </div>

                {
                    webhookpop && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Add webhook</h2>
                            <button
                              onClick={onClose}
                              className="text-gray-500 hover:text-gray-800"
                            >
                              &times;
                            </button>
                          </div>
                  
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Event
                            </label>
                            <select
                              value={event}
                            //   onChange={(e) => setEvent(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <option>Cart creation</option>
                              <option>Order creation</option>
                              <option>Product update</option>
                            </select>
                          </div>
                  
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Format
                            </label>
                            <select
                              value={format}
                            //   onChange={(e) => setFormat(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <option>JSON</option>
                              <option>XML</option>
                            </select>
                          </div>
                  
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">URL</label>
                            <input
                              type="url"
                              value={url}
                            //   onChange={(e) => setUrl(e.target.value)}
                              placeholder="Enter URL"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                  
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Webhook API version
                            </label>
                            <select
                              value={apiVersion}
                            //   onChange={(e) => setApiVersion(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <option>unstable</option>
                              <option>v1</option>
                              <option>v2</option>
                            </select>
                          </div>
                  
                          <div className="flex justify-end">
                            <button
                              onClick={onClose}
                              className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            <button
                            //   onClick={() => alert("Webhook saved!")}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                }
            </div>
        </Settinglayout>
    );
};

export default Webhooks;
