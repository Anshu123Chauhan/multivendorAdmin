import React, { useState } from "react";
import Settinglayout from "../components/Settinglayout";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const PoliciesPage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    console.log(isOpen)
    return (
        <Settinglayout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-xl font-semibold mb-6">Policies</h1>
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Return rules</p>
                                <p className="text-sm text-gray-500">
                                    Enable return rules to simplify return management, set up return
                                    fees, return shipping, and define final sale items
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
                                Manage
                            </button>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-medium mb-4">Written policies</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Policies are linked in the footer of checkout and can be added to
                            your{" "}
                            <a href="#" className="text-blue-500">
                                online store menu
                            </a>
                        </p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border rounded px-4 py-3 hover:bg-gray-50"
                                onClick={() => setIsOpen(true)}
                            >
                                <p className="text-sm">Return and refund policy</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-gray-500">No policy set</p>
                                    <button className="text-blue-500" >›</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border rounded px-4 py-3 hover:bg-gray-50">
                                <p className="text-sm">Privacy policy</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-gray-500">No policy set</p>
                                    <button className="text-blue-500">›</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border rounded px-4 py-3 hover:bg-gray-50">
                                <p className="text-sm">Terms of service</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-gray-500">No policy set</p>
                                    <button className="text-blue-500">›</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border rounded px-4 py-3 hover:bg-gray-50">
                                <p className="text-sm">Shipping policy</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-gray-500">No policy set</p>
                                    <button className="text-blue-500">›</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border rounded px-4 py-3 hover:bg-gray-50">
                                <p className="text-sm">Contact information</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-orange-500 font-semibold">Required</p>
                                    <button className="text-blue-500">›</button>
                                </div>
                            </div>



                            {
                                isOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3">
                                        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">

                                            <div>
                                                <div className="flex justify-between items-center border-b pb-2">
                                                    <div className="text-lg font-medium">Return and Refund Policy</div>
                                                    <button
                                                        className="text-gray-500 hover:text-black"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <ReactQuill
                                                    value={text}
                                                    onChange={setText}
                                                    className="h-40 border rounded-lg"
                                                    theme="snow"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-4 mt-4">
                                                <button
                                                    className="bg-gray-200 px-4 py-2 rounded-md"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                                    onClick={() => {
                                                        console.log("Published Content:", text);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    Publish
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

            </div>
        </Settinglayout>
    );
};

export default PoliciesPage;

