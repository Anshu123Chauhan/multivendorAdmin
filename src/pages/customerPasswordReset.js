import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Settinglayout from "../components/Settinglayout";
import axios from "axios";
import { apiurl } from "../config/config";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import { DynamicLoader } from "../components/loader";

function CustomerPasswordReset() {

    const Token = Cookies.get('zrotoken')
const [loading,setloading] = useState(false)
    const [htmlContent, setHtmlContent] = useState(``);

    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState(false)

    const toggleEditing = () => setIsEditing(!isEditing);

    const saveEdits = async () => {
        setloading(true)
        const data = {
            sellerId: "1234778457844",
            template: htmlContent,
            templateName: "password_reset"

        }
        try {
            const res = await axios.post(`${apiurl}/api/template_route/createUpdatetemplate`,
                data,
                {
                    headers: {
                        Authorization: Token,
                        'Content-Type': 'application/json'
                    },
                }
            );
            if (res.status === 200) {
                setloading(false)
                toast("Updated Successfully")
                setIsEditing(false)
            }
        } catch (error) {
            console.error("Error fetching template:", error.response?.data || error.message);
            setloading(false)
        }

    };

    const handlegettemplate = async () => {
        setloading(true)
        const data = {
            sellerId: "1234778457844",
            templateName: "password_reset"
        }
        try {
            const res = await axios.post(`${apiurl}/api/template_route/get_template`,
                data,
                {
                    headers: {
                        Authorization: Token,
                        'Content-Type': 'application/json'
                    },
                }
            );
            if(res.status === 200){
                setloading(false)
                setHtmlContent(res.data.data[0].template)
            }
            // console.log("Response:", res.data.data[0].template);
        } catch (error) {
            console.error("Error fetching template:", error.response?.data || error.message);
            setloading(false)
        }
    };

    useEffect(() => {
        handlegettemplate()
    }, [])
    return (
        <Settinglayout>
            {loading === true ? <DynamicLoader maintext="wait" subtext="Fetching Template" /> : null}
            <div className="bg-gray-100 min-h-screen p-6">
                <div className="flex justify-between">
                    <div className="flex gap-4 mb-4">
                        <IoIosArrowRoundBack
                            className="text-3xl"
                            onClick={() => {
                                window.history.back();
                            }}
                        />
                        <p className="font-bold">Customer password reset</p>
                    </div>
                    <div className="flex">
                        {isEditing && (
                            <div>
                                <button
                                    className="me-2 bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-500"
                                    onClick={() => { setPreview(true) }}
                                >
                                    preview
                                </button>

                                <button
                                    className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-500"
                                    onClick={saveEdits}
                                >
                                    Save
                                </button>
                            </div>
                        )}
                        <button
                            className="h-fit ms-2 bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-500"
                            onClick={toggleEditing}
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>
                </div>
                {isEditing ? (
                    <textarea
                        rows={20}
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        className="w-full bg-gray-400 text-white rounded p-4"
                    />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                )}

                {
                    preview && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="relative bg-white p-5 rounded shadow-md  max-h-[80vh] overflow-y-auto">
                                <button
                                    onClick={() => setPreview(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                            </div>
                        </div>
                    )
                }

            </div>
        </Settinglayout>
    )
}

export default CustomerPasswordReset;