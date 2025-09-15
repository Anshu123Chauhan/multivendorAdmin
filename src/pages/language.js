import React from "react";
import Settinglayout from '../components/Settinglayout'

const Language = () => {
  return (
    <Settinglayout>
      <div className="flex flex-col items-center p-6 bg-gray-50">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          {/* Header Section */}
          <div className="text-center">
            <img
              src="/path-to-your-image-placeholder" // Replace with your image path
              alt="Language Illustration"
              className="mx-auto w-20 mb-4"
            />
            <h2 className="text-xl font-bold">Speak your customers' language</h2>
            <p className="text-gray-600 mt-2">
              Adding translations to your store improves cross-border conversion
              by an average of 13%. It's free and takes minutes.
            </p>
          </div>

          {/* Add Language Button */}
          <div className="mt-6 text-center">
            <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Add a language
            </button>
          </div>

          {/* Published Languages Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Published languages</h3>
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
              <div>
                <p className="font-medium">English</p>
                <p className="text-sm text-gray-500">Default</p>
              </div>
              <button className="text-gray-500 hover:text-black">
                &#x22EE;
              </button>
            </div>
          </div>

          {/* Shopify Translate & Adapt Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
              <div>
                <h4 className="font-semibold">Shopify Translate & Adapt</h4>
                <p className="text-sm text-gray-500">
                  Translate your store and cater to global audiences
                </p>
                <p className="text-xs text-gray-400 mt-1">4.6 ★ Free</p>
              </div>
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                Install
              </button>
            </div>
          </div>

          {/* Footer Section */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            Learn more about <a href="#" className="text-blue-500">languages</a>.
            To change your account language,{" "}
            <a href="#" className="text-blue-500">manage account</a>.
          </div>
        </div>
      </div>
    </Settinglayout>

  );
};

export default Language;
