import React from 'react';
import Settinglayout from '../components/Settinglayout';

function Locations() {
    return (
        <Settinglayout>
                <h1 className="text-2xl font-bold mb-6">Locations</h1>
            <div className="p-6 max-w-5xl mx-auto bg-gray-50">

                <section className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">All locations</h2>
                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                            Add location
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Using 1 of 1000 active locations available on your plan
                    </p>

                    <div className="flex gap-2 mb-4">
                        {['All', 'Active', 'Inactive', 'POS Pro', 'POS Lite'].map((filter) => (
                            <button
                                key={filter}
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <table className="w-full border border-gray-200 rounded">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="p-2 border-b">Location</th>
                                <th className="p-2 border-b">POS Location</th>
                                <th className="p-2 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-sm">
                                <td className="p-2 border-b">
                                    <div>Shop location</div>
                                    <div className="text-gray-500">India</div>
                                </td>
                                <td className="p-2 border-b">
                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                        POS Pro
                                    </span>
                                </td>
                                <td className="p-2 border-b">
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                                        Active
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                    <section className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Point of Sale subscriptions</h2>
                        <span className="text-gray-400 text-sm">
                            <i className="fas fa-info-circle"></i>
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Start selling in person from any location with the POS subscription included in your Shopify plan
                    </p>
                    <div className="flex items-center justify-between border rounded p-3 bg-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded">
                                <span className="text-white text-lg">S</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Point of Sale</h3>
                                <p className="text-sm text-gray-500">Installed</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300">
                            Open
                        </button>
                    </div>
                </section>

                <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-blue-500 hover:underline">
                        Learn more about locations
                    </a>
                </div>
            </div>
        </Settinglayout>
    )
}

export default Locations;