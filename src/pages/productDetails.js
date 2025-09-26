import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import Layout from "../components/layout";
import BackHeader from "../components/backHeader";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const token = getCookie("zrotoken");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiurl}/admin/product/${id}`, {
          headers: { Authorization: token },
        });
        if (res.status === 200) {
          setProduct(res.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, token]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">No product found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/product" title="Back" />
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Product Details
          </h2>

          {/* Product Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <InfoRow label="Name" value={product.name} />
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Category" value={product?.category?.name} />
            <InfoRow label="Sub Category" value={product?.subCategory?.name} />
            <InfoRow label="Brand" value={product?.brand?.name} />
            <InfoRow label="Product Type" value={product.variants?.length > 0 ? "Variable" : "Single"} />
            <InfoRow label="MRP" value={`₹${product.mrp}`} />
            <InfoRow label="Selling Price" value={`₹${product.sellingPrice}`} />
            <InfoRow label="Inventory" value={product.inventory} />
            <InfoRow label="Status" value={product.status} />
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Product Images */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Product Images</h3>
            <div className="flex gap-2 flex-wrap">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="product"
                  className="w-28 h-28 object-cover rounded"
                />
              ))}
            </div>
          </div>

          {/* Attributes */}
          {product.variants?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Attributes</h3>
              {Object.keys(
                product.variants.reduce((acc, variant) => {
                  variant.attributes.forEach((attr) => {
                    if (!acc[attr.type]) acc[attr.type] = [];
                    if (!acc[attr.type].includes(attr.value)) {
                      acc[attr.type].push(attr.value);
                    }
                  });
                  return acc;
                }, {})
              ).map((key, i) => (
                <InfoRow
                  key={i}
                  label={key}
                  value={product.variants
                    .map((v) =>
                      v.attributes
                        .filter((a) => a.type === key)
                        .map((a) => a.value)
                    )
                    .flat()
                    .join(", ")}
                />
              ))}
            </div>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Variants</h3>
              <div className="space-y-4">
                {product.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="border p-4 rounded space-y-2 bg-gray-50"
                  >
                    <p className="font-medium">
                      {variant.attributes
                        .map((a) => `${a.type}: ${a.value}`)
                        .join(", ")}
                    </p>
                    <p>SKU: {variant.sku}</p>
                    <p>Price: ₹{variant.price}</p>
                    <p>MRP: ₹{variant.mrp}</p>
                    <p>Stock: {variant.stock}</p>

                    <div className="flex gap-2 flex-wrap">
                      {variant.images?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="variant"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default ProductDetails;
