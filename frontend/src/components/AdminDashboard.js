import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AdminDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [logos, setLogos] = useState([]);
  const [features, setFeatures] = useState([]);
  const [abouts, setAbouts] = useState([]);
  const [team, setTeam] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [credentialsForm, setCredentialsForm] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: "",
  });
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [credentialsMessage, setCredentialsMessage] = useState("");
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
  }, [activeTab, token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Always fetch categories and units since they're needed for the products form
      const categoriesResponse = await api.get("/categories");
      setCategories(categoriesResponse.data);

      const unitsResponse = await api.get("/units");
      setUnits(unitsResponse.data);

      if (activeTab === "products") {
        const response = await api.get("/products");
        setProducts(response.data);
      } else if (activeTab === "testimonials") {
        const response = await api.get("/testimonials/admin");
        setTestimonials(response.data);
      } else if (activeTab === "gallery") {
        const response = await api.get("/gallery");
        setGallery(response.data);
      } else if (activeTab === "units") {
        // Units are already fetched above
      } else if (activeTab === "social-media") {
        const response = await api.get("/social-media");
        setSocialMedia(response.data);
      } else if (activeTab === "logos") {
        const response = await api.get("/logos");
        setLogos(response.data);
      } else if (activeTab === "why-choose-us") {
        const response = await api.get("/features/admin");
        setFeatures(response.data);
      } else if (activeTab === "about") {
        const response = await api.get("/about/admin");
        setAbouts(response.data);
      } else if (activeTab === "team") {
        const response = await api.get("/team");
        setTeam(response.data);
      } else if (activeTab === "videos") {
        const response = await api.get("/gallery?type=video");
        setVideos(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTestimonial = async (id) => {
    try {
      await api.put(`/testimonials/${id}/approve`, {});
      fetchData();
    } catch (error) {
      console.error("Error approving testimonial:", error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        onLogout();
      }
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      let endpoint = "";

      if (type === "product") endpoint = `/products/${id}`;
      else if (type === "testimonial") endpoint = `/testimonials/${id}`;
      else if (type === "gallery") endpoint = `/gallery/${id}`;
      else if (type === "category") endpoint = `/categories/${id}`;
      else if (type === "unit") endpoint = `/units/${id}`;
      else if (type === "social-media") endpoint = `/social-media/${id}`;
      else if (type === "logo") endpoint = `/logos/${id}`;
      else if (type === "feature") endpoint = `/features/${id}`;
      else if (type === "about") endpoint = `/about/${id}`;
      else if (type === "video") endpoint = `/gallery/${id}`;
      else if (type === "team") endpoint = `/team/${id}`;

      await api.delete(endpoint);
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        onLogout();
      }
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
      platform: "",
      url: "",
      isActive: true,
      icon: "",
      section: "",
      content: "",
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
      platform: item.platform || "",
      url: item.url || "",
      isActive: item.isActive !== undefined ? item.isActive : true,
      icon: item.icon || "",
      section: item.section || "",
      content: item.content || "",
      name: item.name || "",
      position: item.position || "",
      bio: item.bio || "",
      initials: item.initials || "",
      order: item.order || 0,
      type: item.type || "image",
    });
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // Prevent multiple submissions

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields to FormData, including empty strings for optional fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
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
          response = await api.put(
            `/products/${editingItem._id}`,
            formDataToSend,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else if (editingItem.type === "testimonial") {
          response = await api.put(
            `/testimonials/${editingItem._id}`,
            formDataToSend,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else if (editingItem.type === "gallery") {
          // Add type to formData for gallery updates
          formDataToSend.append("type", formData.type || "image");
          response = await api.put(
            `/gallery/${editingItem._id}`,
            formDataToSend,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else if (editingItem.type === "category") {
          // Categories don't need FormData, send JSON
          const categoryData = {
            name: formData.name,
            isActive: formData.isActive,
          };
          response = await api.put(
            `/categories/${editingItem._id}`,
            categoryData
          );
        } else if (editingItem.type === "unit") {
          // Units don't need FormData, send JSON
          const unitData = {
            name: formData.name,
            isActive: formData.isActive,
          };
          response = await api.put(`/units/${editingItem._id}`, unitData);
        } else if (editingItem.type === "social-media") {
          // Social media doesn't need FormData, send JSON
          const socialMediaData = {
            platform: formData.platform,
            url: formData.url,
            isActive: formData.isActive,
          };
          response = await api.put(
            `/social-media/${editingItem._id}`,
            socialMediaData
          );
        } else if (editingItem.type === "logo") {
          response = await api.put(
            `/logos/${editingItem._id}`,
            formDataToSend,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else if (editingItem.type === "feature") {
          // Features don't need FormData, send JSON
          const featureData = {
            title: formData.title,
            description: formData.description,
            icon: formData.icon,
            isActive: formData.isActive,
          };
          response = await api.put(`/features/${editingItem._id}`, featureData);
        } else if (editingItem.type === "about") {
          // About doesn't need FormData, send JSON
          const aboutData = {
            section: formData.section,
            title: formData.title,
            content: formData.content,
            isActive: formData.isActive,
          };
          response = await api.put(`/about/${editingItem._id}`, aboutData);
        } else if (editingItem.type === "video") {
          // Video update with FormData
          const videoData = new FormData();
          videoData.append("title", formData.title);
          videoData.append("description", formData.description);
          videoData.append("category", formData.category);
          videoData.append("type", "video");
          if (formData.image) {
            videoData.append("image", formData.image);
          }
          response = await api.put(`/gallery/${editingItem._id}`, videoData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (editingItem.type === "team") {
          // Team member update with FormData for image
          const teamData = new FormData();
          teamData.append("name", formData.name);
          teamData.append("position", formData.position);
          teamData.append("bio", formData.bio);
          teamData.append("initials", formData.initials);
          teamData.append("order", formData.order);
          teamData.append("isActive", formData.isActive);
          if (formData.image) {
            teamData.append("image", formData.image);
          }
          response = await api.put(`/team/${editingItem._id}`, teamData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        // Create new item
        if (activeTab === "products") {
          response = await api.post("/products", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (activeTab === "testimonials") {
          response = await api.post("/testimonials", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (activeTab === "gallery") {
          // Add type to formData for gallery creation
          formDataToSend.append("type", formData.type || "image");
          response = await api.post("/gallery", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (activeTab === "categories") {
          // Categories don't need FormData, send JSON
          const categoryData = {
            name: formData.name,
            isActive: formData.isActive,
          };
          response = await api.post("/categories", categoryData);
        } else if (activeTab === "units") {
          // Units don't need FormData, send JSON
          const unitData = {
            name: formData.name,
            isActive: formData.isActive,
          };
          response = await api.post("/units", unitData);
        } else if (activeTab === "social-media") {
          // Social media doesn't need FormData, send JSON
          const socialMediaData = {
            platform: formData.platform,
            url: formData.url,
            isActive: formData.isActive,
          };
          response = await api.post("/social-media", socialMediaData);
        } else if (activeTab === "logos") {
          response = await api.post("/logos", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (activeTab === "why-choose-us") {
          // Features don't need FormData, send JSON
          const featureData = {
            title: formData.title,
            description: formData.description,
            icon: formData.icon,
            isActive: formData.isActive,
          };
          response = await api.post("/features", featureData);
        } else if (activeTab === "about") {
          // About doesn't need FormData, send JSON
          const aboutData = {
            section: formData.section,
            title: formData.title,
            content: formData.content,
            isActive: formData.isActive,
          };
          response = await api.post("/about", aboutData);
        } else if (activeTab === "videos") {
          // Video creation with FormData
          const videoData = new FormData();
          videoData.append("title", formData.title);
          videoData.append("description", formData.description);
          videoData.append("category", formData.category);
          videoData.append("type", "video");
          if (formData.image) {
            videoData.append("image", formData.image);
          }
          response = await api.post("/gallery", videoData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (activeTab === "team") {
          // Team member creation with FormData for image
          const teamData = new FormData();
          teamData.append("name", formData.name);
          teamData.append("position", formData.position);
          teamData.append("bio", formData.bio);
          teamData.append("initials", formData.initials);
          teamData.append("order", formData.order);
          teamData.append("isActive", formData.isActive);
          if (formData.image) {
            teamData.append("image", formData.image);
          }
          response = await api.post("/team", teamData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      alert(`${editingItem ? "Updated" : "Added"} successfully!`);
      setShowAddForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error saving item:", error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        onLogout();
        return;
      }

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

      // Provide user-friendly error messages
      let userFriendlyMessage = errorMessage;

      if (
        errorMessage.includes("validation failed") ||
        errorMessage.includes("Validation failed")
      ) {
        userFriendlyMessage =
          "Please check your input data. Some fields may be invalid or missing.";
      } else if (errorMessage.includes("not a valid enum")) {
        userFriendlyMessage =
          "Please select a valid option from the dropdown menus.";
      } else if (
        errorMessage.includes("duplicate key error") ||
        errorMessage.includes("E11000")
      ) {
        userFriendlyMessage =
          "This item already exists. Please use a different name or value.";
      } else if (errorMessage.includes("Cast to ObjectId failed")) {
        userFriendlyMessage =
          "Invalid item ID. Please refresh the page and try again.";
      } else if (errorMessage.includes("No matching document found")) {
        userFriendlyMessage =
          "The item you're trying to update no longer exists. Please refresh the page.";
      }

      alert(`Error saving item: ${userFriendlyMessage}`);
    } finally {
      setSubmitting(false);
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
    { id: "videos", name: "Videos" },
    { id: "categories", name: "Categories" },
    { id: "units", name: "Units" },
    { id: "social-media", name: "Social Media" },
    { id: "logos", name: "Logos" },
    { id: "why-choose-us", name: "Why Choose Us" },
    { id: "about", name: "About" },
    { id: "team", name: "Team" },
    { id: "credentials", name: "Credentials" },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
      localStorage.removeItem("accessToken");
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout on frontend even if backend fails
      localStorage.removeItem("accessToken");
      onLogout();
    }
  };

  const copyPublicUrl = () => {
    const publicUrl = `${window.location.origin}/public`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      alert("Public URL copied to clipboard!");
    });
  };

  const handleCredentialsUpdate = async (e) => {
    e.preventDefault();
    setCredentialsLoading(true);
    setCredentialsMessage("");

    try {
      const response = await api.put("/admin/credentials", credentialsForm);
      setCredentialsMessage("Credentials updated successfully!");
      setCredentialsForm({
        currentPassword: "",
        newEmail: "",
        newPassword: "",
      });
    } catch (error) {
      setCredentialsMessage(
        error.response?.data?.message || "Failed to update credentials"
      );
    } finally {
      setCredentialsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-800">
          Admin Dashboard
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => window.open("/public", "_blank")}
            className="btn-primary"
          >
            View Public Site
          </button>
          <button onClick={copyPublicUrl} className="btn-secondary">
            Copy Public URL
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

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
                    {categories
                      .filter((cat) => cat.isActive)
                      .map((category) => (
                        <option
                          key={category._id}
                          value={category.name.toLowerCase()}
                        >
                          {category.name}
                        </option>
                      ))}
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
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit._id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
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
                  <select
                    name="type"
                    value={formData.type || "image"}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
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
                    accept={
                      (formData.type || "image") === "video"
                        ? "video/*"
                        : "image/*"
                    }
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

              {activeTab === "videos" && (
                <>
                  <input
                    type="text"
                    name="title"
                    placeholder="Video Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="Video Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="video/*"
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

              {activeTab === "categories" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive !== undefined
                          ? formData.isActive
                          : true
                      }
                      onChange={handleInputChange}
                    />
                    <label>Active</label>
                  </div>
                </>
              )}

              {activeTab === "units" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Unit Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive !== undefined
                          ? formData.isActive
                          : true
                      }
                      onChange={handleInputChange}
                    />
                    <label>Active</label>
                  </div>
                </>
              )}

              {activeTab === "social-media" && (
                <>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="tiktok">TikTok</option>
                    <option value="snapchat">Snapchat</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="reddit">Reddit</option>
                    <option value="discord">Discord</option>
                    <option value="telegram">Telegram</option>
                    <option value="wechat">WeChat</option>
                    <option value="line">Line</option>
                    <option value="twitch">Twitch</option>
                    <option value="medium">Medium</option>
                    <option value="tumblr">Tumblr</option>
                    <option value="flickr">Flickr</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="soundcloud">SoundCloud</option>
                    <option value="spotify">Spotify</option>
                    <option value="apple-podcasts">Apple Podcasts</option>
                    <option value="google-podcasts">Google Podcasts</option>
                    <option value="clubhouse">Clubhouse</option>
                    <option value="threads">Threads</option>
                    <option value="bluesky">Bluesky</option>
                    <option value="mastodon">Mastodon</option>
                    <option value="weibo">Weibo</option>
                    <option value="xing">Xing</option>
                    <option value="vkontakte">VKontakte</option>
                    <option value="periscope">Periscope</option>
                    <option value="mix">Mix</option>
                    <option value="nextdoor">Nextdoor</option>
                    <option value="meetup">Meetup</option>
                    <option value="eventbrite">Eventbrite</option>
                  </select>
                  <input
                    type="url"
                    name="url"
                    placeholder="Social Media URL"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive !== undefined
                          ? formData.isActive
                          : true
                      }
                      onChange={handleInputChange}
                    />
                    <label>Active</label>
                  </div>
                </>
              )}

              {activeTab === "logos" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Logo Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive !== undefined
                          ? formData.isActive
                          : true
                      }
                      onChange={handleInputChange}
                    />
                    <label>Active</label>
                  </div>
                </>
              )}

              {activeTab === "why-choose-us" && (
                <>
                  <input
                    type="text"
                    name="title"
                    placeholder="Feature Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="Feature Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Icon Name
                    </label>
                    <input
                      type="text"
                      name="icon"
                      placeholder="e.g., bike, car, truck, leaf, egg, horse..."
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      Type the name of any icon (e.g., "bike", "car", "truck",
                      "leaf", "egg"). The icon will automatically appear in the
                      public view.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive !== undefined
                          ? formData.isActive
                          : true
                      }
                      onChange={handleInputChange}
                    />
                    <label>Active</label>
                  </div>
                </>
              )}

              {activeTab === "about" && (
                <>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Section</option>
                    <option value="history">History</option>
                    <option value="mission">Mission</option>
                    <option value="values">Values</option>
                  </select>
                  <input
                    type="text"
                    name="title"
                    placeholder="Section Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="content"
                    placeholder="Section Content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive !== undefined
                          ? formData.isActive
                          : true
                      }
                      onChange={handleInputChange}
                    />
                    <label>Active</label>
                  </div>
                </>
              )}

              {activeTab === "team" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="position"
                    placeholder="Position/Title"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="bio"
                    placeholder="Bio/Description"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                  <input
                    type="text"
                    name="initials"
                    placeholder="Initials (e.g., JG, MW, DK)"
                    value={formData.initials}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    name="order"
                    placeholder="Display Order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={
                        formData.isActive !== undefined
                          ? formData.isActive
                          : true
                      }
                      onChange={handleInputChange}
                    />
                    <label>Active</label>
                  </div>
                </>
              )}

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingItem ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary flex-1"
                  disabled={submitting}
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
                  Add New Item
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div key={item._id} className="card">
                    {item.type === "video" ? (
                      <video
                        src={item.video}
                        className="w-full h-32 object-cover rounded-t-lg"
                        controls
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            item.type === "video"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleEdit(item, "gallery")}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("gallery", item._id)}
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

          {activeTab === "categories" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  Categories Management
                </h2>
                <button
                  onClick={() => handleAddNew("category")}
                  className="btn-primary"
                >
                  Add New Category
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category._id} className="card">
                    <div className="p-4">
                      <h3 className="font-semibold">{category.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(category, "category")}
                            className="btn-secondary text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete("category", category._id)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "units" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Units Management</h2>
                <button
                  onClick={() => handleAddNew("unit")}
                  className="btn-primary"
                >
                  Add New Unit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                  <div key={unit._id} className="card">
                    <div className="p-4">
                      <h3 className="font-semibold">{unit.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            unit.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {unit.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(unit, "unit")}
                            className="btn-secondary text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete("unit", unit._id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "social-media" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  Social Media Management
                </h2>
                <button
                  onClick={() => handleAddNew("social-media")}
                  className="btn-primary"
                >
                  Add Social Media
                </button>
              </div>
              <div className="space-y-4">
                {socialMedia.map((social) => (
                  <div key={social._id} className="card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold capitalize text-primary-600 hover:text-primary-800 cursor-pointer"
                        >
                          {social.platform}
                        </a>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800"
                        >
                          {social.url}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            social.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {social.isActive ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => handleEdit(social, "social-media")}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete("social-media", social._id)
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

          {activeTab === "logos" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Logo Management</h2>
                <button
                  onClick={() => handleAddNew("logo")}
                  className="btn-primary"
                >
                  Add New Logo
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logos.map((logo) => (
                  <div key={logo._id} className="card">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="w-full h-32 object-contain rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{logo.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            logo.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {logo.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(logo, "logo")}
                            className="btn-secondary text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete("logo", logo._id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "why-choose-us" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  Why Choose Us Management
                </h2>
                <button
                  onClick={() => handleAddNew("feature")}
                  className="btn-primary"
                >
                  Add New Feature
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <div key={feature._id} className="card">
                    <div className="p-4">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-secondary-600 text-sm mt-2">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            feature.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {feature.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(feature, "feature")}
                            className="btn-secondary text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete("feature", feature._id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">About Management</h2>
                <button
                  onClick={() => handleAddNew("about")}
                  className="btn-primary"
                >
                  Add New About Content
                </button>
              </div>
              <div className="space-y-4">
                {abouts.map((about) => (
                  <div key={about._id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold capitalize">
                            {about.section}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              about.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {about.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <h3 className="font-medium">{about.title}</h3>
                        <p className="text-secondary-600 mt-2">
                          {about.content}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(about, "about")}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("about", about._id)}
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

          {activeTab === "videos" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Videos Management</h2>
                <button
                  onClick={() => handleAddNew("video")}
                  className="btn-primary"
                >
                  Add New Video
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="card">
                    <video
                      src={video.video}
                      className="w-full h-32 object-cover rounded-t-lg"
                      controls
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-secondary-600 text-sm">
                        {video.description}
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleEdit(video, "video")}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("gallery", video._id)}
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

          {activeTab === "team" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Team Management</h2>
                <button
                  onClick={() => handleAddNew("team")}
                  className="btn-primary"
                >
                  Add New Team Member
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                  <div key={member._id} className="card">
                    <div className="flex items-center space-x-4 p-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                        {member.initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-secondary-600 text-sm">
                          {member.position}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              member.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(member, "team")}
                              className="btn-secondary text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete("team", member._id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "credentials" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Admin Credentials Management
              </h2>
              <div className="max-w-md">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">
                    Change Password & Email
                  </h3>
                  <form onSubmit={handleCredentialsUpdate}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={credentialsForm.currentPassword}
                        onChange={(e) =>
                          setCredentialsForm((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        New Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={credentialsForm.newEmail}
                        onChange={(e) =>
                          setCredentialsForm((prev) => ({
                            ...prev,
                            newEmail: e.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="Leave empty to keep current email"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        New Password (Optional)
                      </label>
                      <input
                        type="password"
                        value={credentialsForm.newPassword}
                        onChange={(e) =>
                          setCredentialsForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="Leave empty to keep current password"
                        minLength={6}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary"
                      disabled={credentialsLoading}
                    >
                      {credentialsLoading
                        ? "Updating..."
                        : "Update Credentials"}
                    </button>
                  </form>
                  {credentialsMessage && (
                    <div
                      className={`mt-4 px-4 py-3 rounded ${
                        credentialsMessage.includes("success")
                          ? "bg-green-100 border border-green-400 text-green-700"
                          : "bg-red-100 border border-red-400 text-red-700"
                      }`}
                    >
                      {credentialsMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
