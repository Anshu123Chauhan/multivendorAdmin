import React, { useState, useEffect} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import Layout from "../components/layout";
import { FloatingInput } from "../components/floatingInput";
import BackHeader from "../components/backHeader";
import { useNavigate,useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    description: "",
    images: [], // multiple images for product
    isActive: true,
    productType: "", // ✅ single or variable
    sellingPrice: "",
    mrp: "",
    sku: "",
    inventory: "",
    tags: "",
    attributes: {}, // for variable products
    variants: [], // will be generated
    usertype: "",
    status:""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newAttr, setNewAttr] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [categorydata, setCategoryData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const token = getCookie("zrotoken");
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "category":
        if (!value.trim()) error = "Category is required.";
        break;
      case "description":
      if (!value.trim()) error = "Description is required.";
      break;
      case "mrp":
        if (!value) error = "MRP is required.";
        break;
      case "sellingPrice":
       if (!value) error = "Selling Price is required.";
        break;
     case "productType":
       if (!value.trim()) error = "Product Type is required.";
        break;
      case "sku":
        if (!value.trim()) error = "SKU is required.";
        break;
      case "images":
        if (!value) error = "Product Image is required.";
        break;
      case "inventory":
        if (!value) error = "Inventory is required.";
        break;
      
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };
  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };
    useEffect(() => {
      
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${apiurl}/admin/product/${id}`, {
          headers: { Authorization: token },
        });
         if (res.status === 200) {
   const product = res.data;

  // Collect attributes grouped by type
  const attributes = {};
  product.variants.forEach(variant => {
    variant.attributes.forEach(attr => {
      if (!attributes[attr.type]) {
        attributes[attr.type] = [];
      }
      if (!attributes[attr.type].includes(attr.value)) {
        attributes[attr.type].push(attr.value);
      }
    });
  });
  setFormData({
    ...product,
    category: product?.category?._id || "",
    subCategory: product?.subCategory?._id || "",
    brand: product?.brand?._id || "",
    productType: product?.variants?.length > 0 ? "variable" : "single",
    attributes: attributes,
    variants: product.variants || [],
  });

          // ✅ make sure subcategories are filtered after product load
          fetchsubCategoryList(product?.category?._id, product?.subCategory?._id);
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

  // ------------ Handlers ------------
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "images" && files && files.length > 0) {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => handleFileUpload(file))
      );

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls.filter(Boolean)], // merge with old
      }));

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });

      return;
    }

    setFormData((prev) => ({
      ...prev,
      meta: formData.name,
      [name]: value,
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value) delete newErrors[name];
      return newErrors;
    });
  };
  const fetchCategoryList = async () => {
      try {
        const response = await axios.get(`${apiurl}/admin/category`, {
          headers: { Authorization: token,},
        });
        if (response?.data?.data?.length > 0) {
          setCategoryData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
  };

const fetchsubCategoryList = async (catid = "", selectedSub = "") => {
  try {
    const response = await axios.get(`${apiurl}/admin/category/sub/list`, {
      headers: { Authorization: token },
    });
    if (response?.data?.data?.length > 0) {
      setSubcategories(response.data.data);

      // filter by category if passed
      if (catid) {
        const filtered = response.data.data.filter(
          (sub) => sub.category._id === catid
        );
        setFilteredSubcategories(filtered);

        // ✅ keep the selected subcategory
        setFormData((prev) => ({
          ...prev,
          category: catid,
          subCategory: selectedSub || prev.subCategory,
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
  }
};

  const fetchBrandList = async () => {
      try {
        const response = await axios.get(
          `${apiurl}/admin/brand`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response?.data);
        if (response?.data.success === true) {
          setBrands(response?.data?.data || []);
          
        }
      } catch (error) {
        console.error("Error fetching store list:", error);
      } finally {
      }
  };

  
  const handleCategoryChange = (e) => {
  const { value } = e.target;

  setFormData((prev) => ({
    ...prev,
    category: value,
    subCategory: "", // reset subCategory
  }));

  // filter subcategories belonging to this category
  const filtered = subcategories.filter(
    (sub) => sub.category._id === value
  );
  setFilteredSubcategories(filtered);
};
  useEffect(() => {
    fetchCategoryList();
    fetchsubCategoryList();
    fetchBrandList();
  }, [])
  const handleFileUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "lakmesalon");
    data.append("cloud_name", "dv5del8nh");

    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dv5del8nh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      let result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };
  const handleVariantImagesChange = async (idx, files) => {
  const uploadedUrls = await Promise.all(
    Array.from(files).map((file) => handleFileUpload(file))
  );

  setFormData((prev) => {
    const updated = [...prev.variants];
    updated[idx] = {
      ...updated[idx],
      images: [...(updated[idx].images || []), ...uploadedUrls.filter(Boolean)],
    };
    return { ...prev, variants: updated };
  });
};

  const handleVariantChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleVariantImages = (idx, files) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[idx] = {
        ...updated[idx],
        images: [
          ...(updated[idx].images || []),
          ...Array.from(files).map((f) => URL.createObjectURL(f)),
        ],
      };
      return { ...prev, variants: updated };
    });
  };

const handleAttributeChange = (attrName, values) => {
  setFormData((prev) => ({
    ...prev,
    attributes: {
      ...prev.attributes,
      [attrName]: values, // already array now
    },
  }));
};



  const addAttribute = () => {
    if (!newAttr.trim()) return;
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [newAttr.trim()]: [],
      },
    }));
    setNewAttr("");
  };

const generateVariants = () => {
  const { attributes } = formData;
  const attrKeys = Object.keys(attributes);
  if (attrKeys.length === 0) {
    toast.warning("Please add at least one attribute.");
    return;
  }

  // Cartesian product helper
  const cartesian = (arr) =>
    arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [[]]);

  const combinations = cartesian(
    attrKeys.map((key) => attributes[key] || [])
  );

  if (combinations.length === 0) {
    toast.warning("Please enter values for attributes.");
    return;
  }

  const newVariants = combinations.map((combo) => {
    const attrs = combo.map((val, i) => ({
      type: attrKeys[i],
      value: val,
    }));

    // Check if variant already exists
    const existing = formData.variants.find((v) =>
      JSON.stringify(v.attributes) === JSON.stringify(attrs)
    );

    return existing || {
      sku: "",
      price: "",
      mrp: "",
      stock: "",
      images: [],
      attributes: attrs,
    };
  });

  setFormData((prev) => ({ ...prev, variants: newVariants }));
};


  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      return;
    }
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      subCategory: formData.subCategory,
      brand: formData.brand,
      images: formData.images, // ⚠️ should be uploaded URLs in real API
      sellingPrice: formData.sellingPrice,
      mrp: formData.mrp,
      sku:formData.sku,
      inventory: formData.inventory,
      productType: formData.productType,
      status:formData.status,
      // tags: formData?.tags ? formData?.tags?.split(",").map((t) => t.trim()) : [],
      tags:[],
      variants:
        formData.productType === "variable"
          ? formData.variants.map((variant) => ({
              sku: variant.sku,
              price: variant.price,
              mrp: variant.mrp,
              stock: variant.stock,
              images: variant.images,
              attributes: variant.attributes,
            }))
          : [],
    };

    try {
      setLoading(true);
      const response = await axios.put(`${apiurl}/admin/product/${id}`, payload, {
        headers: { Authorization: token },
      });
      toast.success("Product created successfully!");
      console.log("Product created:", response.data);

      // reset form
      setFormData({
        name: "",
        brand: "",
        category: "",
        subCategory: "",
        description: "",
        images: [],
        isActive: true,
        productType: "single",
        sellingPrice: "",
        mrp: "",
        sku: "",
        inventory: "",
        tags: "",
        attributes: {},
        variants: [],
        usertype: "",
      });
      navigate("/product")
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/product" title="Back" />
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Edit Product
          </h2>

         
            <div className="grid md:grid-cols-2 gap-6">
              <FloatingInput
                label="Product Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <FloatingInput
                label="SKU"
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                error={errors.sku}
                required={true}
              />
              <FloatingInput
                label="Select Category"
                type="select"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}   // ✅ use new handler
                error={errors.category}
                required={true}
                options={[
                  { value: "", label: "" },
                  ...categorydata.map((item) => ({
                    value: item._id,
                    label: item.name,
                  })),
                ]}
              />

              <FloatingInput
                label="Select Sub Category"
                type="select"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                error={errors.subCategory}
                required={true}
                options={[
                  { value: "", label: "" },
                  ...filteredSubcategories.map((item) => ({
                    value: item._id,
                    label: item.name,
                  })),
                ]}
              />

                 <FloatingInput
                  label="Select Brand"
                  type="select"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  error={errors.brand}
                  // required={true}
                  options={[
                    { value: "", label: "" },
                    ...brands.map((item) => ({
                      value: item._id,
                      label: item.name,
                    })),
                  ]}
                />
                 <FloatingInput
                  label="Product Type"
                  type="select"
                  name="productType"
                  value={formData.productType}
                 onChange={handleChange}
                  error={errors.productType}
                  required={true}
                   options={[
                  { value: "", label: "" },
                  { value: "single", label: "Single" },
                  { value: "variable", label: "Variable" },
                   ]}
                />
                
            </div>

            <FloatingInput
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
            />

            {/* Product Images */}
            
            {/* Pricing */}
            <div className="grid md:grid-cols-3 gap-6">
              <FloatingInput
                label="MRP"
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                error={errors.mrp}
                required
              />
              <FloatingInput
                label="Selling Price"
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                error={errors.sellingPrice}
                required
              />
              <FloatingInput
                label="Inventory"
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                error={errors.inventory}
                required
              />
              <div>
              <label className="block mb-2 font-medium">Product Images<span className="text-red-500 ml-1">*</span></label>
              <FloatingInput
                label="Upload Products Image"
                type="file"
                name="images"
                multiple
                onChange={handleChange}
                error={errors.images}
                required={true}
              />
             
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            </div>

            {/* Only show Variants if variable */}
            {formData.productType === "variable" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Attributes</h3>

                {/* Add Attribute */}
                <div className="flex items-center gap-2">
                  <FloatingInput
                    label="New Attribute (e.g. Color, Size)"
                    type="text"
                    value={newAttr}
                    onChange={(e) => setNewAttr(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-green-600 text-white rounded"
                    onClick={addAttribute}
                  >
                    Add
                  </button>
                </div>

                {/* Attribute Inputs */}
               {Object.keys(formData.attributes).map((attrName, idx) => (
               <textarea
  key={idx}
  placeholder={`Enter ${attrName} values (comma separated)`}
  value={formData.attributes[attrName]?.join(",") || ""}  // ✅ show as string
  onChange={(e) =>
    handleAttributeChange(attrName, e.target.value.split(",").map(v => v.trim())) // ✅ store as array
  }
  className="w-full border rounded p-2"
/>


                ))}


                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={generateVariants}
                >
                  Generate Variants
                </button>

                {/* Variants */}
                {formData.variants.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mt-6">Variants</h3>
                    {formData.variants.map((variant, idx) => (
                      <div key={idx} className="border p-4 rounded space-y-4">
                        <h4 className="font-medium">
                          Variant {idx + 1} -{" "}
                          {variant.attributes
                            .map(attr => `${attr.type}: ${attr.value}`)
                            .join(", ")}
                        </h4>

                        <div className="grid md:grid-cols-3 gap-6">
                          <FloatingInput
                            label="SKU"
                            type="text"
                            value={variant.sku}
                            onChange={(e) =>
                              handleVariantChange(idx, "sku", e.target.value)
                            }
                          />
                          <FloatingInput
                            label="Price"
                            type="number"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(idx, "price", e.target.value)
                            }
                          />
                          <FloatingInput
                            label="MRP"
                            type="number"
                            value={variant.mrp}
                            onChange={(e) =>
                              handleVariantChange(idx, "mrp", e.target.value)
                            }
                          />
                          <FloatingInput
                            label="Stock"
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(idx, "stock", e.target.value)
                            }
                          />
                        </div>

                        {/* Variant Images */}
                        <div>
                          <label className="block mb-2 font-medium">
                            Variant Images
                          </label>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleVariantImagesChange(idx, e.target.files)}
                          />

                          <div className="flex gap-2 mt-2 flex-wrap">
                            {variant.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt="preview"
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, status: "active" }))
                      }
                      className="text-[#D4550B] focus:ring-[#D4550B] border"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === "draft"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, status: "draft" }))
                      }
                      className="text-[#D4550B] focus:ring-[#D4550B] border"
                    />
                    Inactive
                  </label>
                </div>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit} 
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
