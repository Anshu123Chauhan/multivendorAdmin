import React from 'react';
import Settinglayout from '../components/Settinglayout';

function CustomData() {
    const items = [
        { name: 'Products', count: 0 },
        { name: 'Variants', count: 0 },
        { name: 'Collections', count: 0 },
        { name: 'Customers', count: 0 },
        { name: 'Orders', count: 0 },
        { name: 'Draft orders', count: 0 },
        { name: 'Companies', count: 0 },
        { name: 'Company locations', count: 0 },
        { name: 'Locations', count: 0 },
        { name: 'Pages', count: 0 },
        { name: 'Blogs', count: 0 },
        { name: 'Blog posts', count: 0 },
        { name: 'Markets', count: 0 },
    ];

    return (
        <Settinglayout>

            <div className="bg-gray-50 min-h-screen p-8">
                <h2 className="text-xl font-semibold mb-4">Custom data</h2>
                <div className="bg-white shadow rounded-lg p-6 w-9/12">
                    <p className="text-gray-500 mb-6">
                        Add a custom piece of data to a specific part of your store.
                    </p>

                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-gray-100 p-4 rounded-md hover:bg-gray-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-800 font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-500">{item.count}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-blue-700 font-medium mb-2">
                            Define your first metaobject
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Metaobjects allow you to group fields and connect them to different parts of your store. Use them to create custom content or data structures.
                        </p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Add definition
                        </button>
                    </div>
                </div>
            </div>
        </Settinglayout>

    );
}

export default CustomData;
