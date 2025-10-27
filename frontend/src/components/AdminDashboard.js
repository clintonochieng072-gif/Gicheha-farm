import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = ({ token }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: null,
    message: "",
    rating: "",
    title: "",
    inStock: true,
    quantity: "",
    unit: "kg",
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "products") {
        const response = await axios.get("/api/products", { headers });
        setProducts(response.data);
      } else if (activeTab === "testimonials") {
        const response = await axios.get("/api/testimonials/admin", {
          headers,
        });
        setTestimonials(response.data);
      } else if (activeTab === "gallery") {
        const response = await axios.get("/api/gallery", { headers });
        setGallery(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTestimonial = async (id) => {
    try {
      await axios.put(
        `/api/testimonials/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error approving testimonial:", error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      let endpoint = "";

      if (type === "product") endpoint = `/api/products/${id}`;
      else if (type === "testimonial") endpoint = `/api/testimonials/${id}`;
      else if (type === "gallery") endpoint = `/api/gallery/${id}`;

      await axios.delete(endpoint, { headers });
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddNew = (type) => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      images: null,
      message: "",
      rating: "",
      title: "",
      inStock: true,
      quantity: "",
      unit: "kg",
    });
    setShowAddForm(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "",
      images: null,
      message: item.message || "",
      rating: item.rating || "",
      title: item.title || "",
      inStock: item.inStock !== undefined ? item.inStock : true,
      quantity: item.quantity || "",
      unit: item.unit || "kg",
    });
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const formDataToSend = new FormData();

      // Add all form fields to FormData, including empty strings for optional fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          if (key === "images" && formData[key]) {
            // Handle multiple files
            for (let i = 0; i < formData[key].length; i++) {
              formDataToSend.append("images", formData[key][i]);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      let response;
      if (editingItem) {
        // Update existing item
        if (editingItem.type === "product") {
          response = await axios.put(
            `/api/products/${editingItem._id}`,
            formDataToSend,
            { headers: { ...headers, "Content-Type": "multipart/form-data" } }
          );
        } else if (editingItem.type === "testimonial") {
          response = await axios.put(
            `/api/testimonials/${editingItem._id}`,
            formDataToSend,
            { headers: { ...headers, "Content-Type": "multipart/form-data" } }
          );
        } else if (editingItem.type === "gallery") {
          response = await axios.put(
            `/api/gallery/${editingItem._id}`,
            formDataToSend,
            { headers: { ...headers, "Content-Type": "multipart/form-data" } }
          );
        }
      } else {
        // Create new item
        if (activeTab === "products") {
          response = await axios.post("/api/products", formDataToSend, {
            headers: { ...headers, "Content-Type": "multipart/form-data" },
          });
        } else if (activeTab === "testimonials") {
          response = await axios.post("/api/testimonials", formDataToSend, {
            headers: { ...headers, "Content-Type": "multipart/form-data" },
          });
        } else if (activeTab === "gallery") {
          response = await axios.post("/api/gallery", formDataToSend, {
            headers: { ...headers, "Content-Type": "multipart/form-data" },
          });
        }
      }

      alert(`${editingItem ? "Updated" : "Added"} successfully!`);
      setShowAddForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error saving item:", error);
      let errorMessage = "Unknown error occurred";

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors
            .map((err) =>
              typeof err === "string" ? err : err.msg || err.message
            )
            .join(", ");
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error saving item: ${errorMessage}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? name === "images"
            ? files
            : files[0]
          : value,
    }));
  };

  const tabs = [
    { id: "products", name: "Products" },
    { id: "testimonials", name: "Testimonials" },
    { id: "gallery", name: "Gallery" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-secondary-800 mb-8">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="border-b border-secondary-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem
                ? `Edit ${activeTab.slice(0, -1)}`
                : `Add New ${activeTab.slice(0, -1)}`}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {activeTab === "products" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Category (Optional)</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="grains">Grains</option>
                    <option value="poultry">Poultry</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                    />
                    <label>In Stock</label>
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="pieces">pieces</option>
                    <option value="liters">liters</option>
                    <option value="dozen">dozen</option>
                    <option value="tray">tray</option>
                    <option value="single piece">single piece</option>
                  </select>
                </>
              )}

              {activeTab === "testimonials" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Customer Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="message"
                    placeholder="Testimonial Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              {activeTab === "gallery" && (
                <>
                  <input
                    type="text"
                    name="title"
                    placeholder="Image Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="general">General</option>
                    <option value="farm">Farm</option>
                    <option value="products">Products</option>
                    <option value="events">Events</option>
                  </select>
                </>
              )}

              <div className="flex space-x-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Products Management</h2>
                <button
                  onClick={() => handleAddNew("product")}
                  className="btn-primary"
                >
                  Add New Product
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="card">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-32 object-contain rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-secondary-600 text-sm">
                        KSh {product.price}
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleEdit(product, "product")}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("product", product._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Remove Product
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  Testimonials Management
                </h2>
                <button
                  onClick={() => handleAddNew("testimonial")}
                  className="btn-primary"
                >
                  Add Testimonial
                </button>
              </div>
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial._id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">
                            {testimonial.name}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              testimonial.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {testimonial.isApproved ? "Approved" : "Pending"}
                          </span>
                        </div>
                        <p className="text-secondary-600">
                          {testimonial.message}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {!testimonial.isApproved && (
                          <button
                            onClick={() =>
                              handleApproveTestimonial(testimonial._id)
                            }
                            className="btn-primary text-xs"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDelete("testimonial", testimonial._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Gallery Management</h2>
                <button
                  onClick={() => handleAddNew("gallery")}
                  className="btn-primary"
                >
                  Add New Image
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((image) => (
                  <div key={image._id} className="card">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-32 object-contain rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{image.title}</h3>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleEdit(image, "gallery")}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("gallery", image._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
