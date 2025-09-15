import React from 'react';
import Settinglayout from '../components/Settinglayout';

function Domains() {
    return (
        <Settinglayout>
            <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold">Domains</h1>

                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                        <div className="space-x-3">
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                Connect existing domain
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                Transfer Domain
                            </button>
                            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                                Buy new domain
                            </button>
                        </div>
                    </div>

                    {/* Domain List */}
                    <div className="space-y-4">
                        {/* Domain Item */}
                        <div className="border rounded-md p-4">
                            <p className="text-lg font-medium">
                                <span className="mr-2">🌐</span> www.dummy.shop
                            </p>
                            <p className="text-sm text-gray-600">Primary for Online Store</p>
                        </div>

                        {/* Domain Item */}
                        <div className="border rounded-md p-4">
                            <p className="text-lg font-medium">
                                <span className="mr-2">📄</span> dummy.myshopify.com
                            </p>
                            <p className="text-sm text-gray-600">
                                Redirects to www.shop
                            </p>
                            <a
                                href="#"
                                className="text-blue-500 hover:underline text-sm mt-2 block"
                            >
                                Change to a new myshopify.com domain
                            </a>
                        </div>

                        {/* Domain Item */}
                        <div className="border rounded-md p-4">
                            <p className="text-lg font-medium">
                                <span className="mr-2">📄</span> xyz.shop
                            </p>
                            <p className="text-sm text-gray-600">
                                Redirects to www.xyz.shop
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        <a href="#" className="text-blue-500 hover:underline">
                            Learn more about domains
                        </a>
                    </div>
                </div>
            </div>
        </Settinglayout>
    )
}

export default Domains