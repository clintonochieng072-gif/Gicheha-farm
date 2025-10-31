import React, { useState, useEffect } from "react";
import api from "../utils/api";

const AdminDashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [activeSection, setActiveSection] = useState("products");
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
  const [currentFormType, setCurrentFormType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [credentialsForm, setCredentialsForm] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: "",
  });
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [credentialsMessage, setCredentialsMessage] = useState("");
  const [expandedProducts, setExpandedProducts] = useState(false);
  const [expandedGallery, setExpandedGallery] = useState(false);
  const [expandedVideos, setExpandedVideos] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState(false);
  const [expandedSocialMedia, setExpandedSocialMedia] = useState(false);
  const [expandedLogos, setExpandedLogos] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState(false);
  const [expandedAbouts, setExpandedAbouts] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState(false);
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
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data simultaneously since all sections are visible
      const [
        categoriesResponse,
        unitsResponse,
        productsResponse,
        testimonialsResponse,
        galleryResponse,
        socialMediaResponse,
        logosResponse,
        featuresResponse,
        aboutsResponse,
        teamResponse,
        videosResponse,
      ] = await Promise.all([
        api.get(`/categories?t=${Date.now()}`),
        api.get(`/units?t=${Date.now()}`),
        api.get(`/products?t=${Date.now()}`),
        api.get(`/testimonials/admin?t=${Date.now()}`),
        api.get(`/gallery?t=${Date.now()}`),
        api.get(`/social-media?t=${Date.now()}`),
        api.get(`/logos?t=${Date.now()}`),
        api.get(`/features/admin?t=${Date.now()}`),
        api.get(`/about/admin?t=${Date.now()}`),
        api.get(`/team?t=${Date.now()}`),
        api.get(`/gallery?type=video&t=${Date.now()}`),
      ]);

      setCategories(categoriesResponse.data);
      setUnits(unitsResponse.data);
      setProducts(productsResponse.data);
      setTestimonials(testimonialsResponse.data);
      setGallery(galleryResponse.data);
      setSocialMedia(socialMediaResponse.data);
      setLogos(logosResponse.data);
      setFeatures(featuresResponse.data);
      setAbouts(aboutsResponse.data);
      setTeam(teamResponse.data);
      setVideos(videosResponse.data);
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
    setCurrentFormType(type);
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
      type: type === "videos" ? "video" : type === "gallery" ? "image" : "",
    });
    setShowAddForm(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setCurrentFormType(type);
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
        if (currentFormType === "products") {
          response = await api.post("/products", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (currentFormType === "testimonials") {
          response = await api.post("/testimonials", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (currentFormType === "gallery") {
          // Add type to formData for gallery creation
          formDataToSend.append("type", formData.type || "image");
          response = await api.post("/gallery", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (currentFormType === "categories") {
          // Categories don't need FormData, send JSON
          const categoryData = {
            name: formData.name,
            isActive: formData.isActive,
          };
          response = await api.post("/categories", categoryData);
        } else if (currentFormType === "units") {
          // Units don't need FormData, send JSON
          const unitData = {
            name: formData.name,
            isActive: formData.isActive,
          };
          response = await api.post("/units", unitData);
        } else if (currentFormType === "social-media") {
          // Social media doesn't need FormData, send JSON
          const socialMediaData = {
            platform: formData.platform,
            url: formData.url,
            isActive: formData.isActive,
          };
          response = await api.post("/social-media", socialMediaData);
        } else if (currentFormType === "logos") {
          response = await api.post("/logos", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (currentFormType === "why-choose-us") {
          // Features don't need FormData, send JSON
          const featureData = {
            title: formData.title,
            description: formData.description,
            icon: formData.icon,
            isActive: formData.isActive,
          };
          response = await api.post("/features", featureData);
        } else if (currentFormType === "about") {
          // About doesn't need FormData, send JSON
          const aboutData = {
            section: formData.section,
            title: formData.title,
            content: formData.content,
            isActive: formData.isActive,
          };
          response = await api.post("/about", aboutData);
        } else if (currentFormType === "videos") {
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
        } else if (currentFormType === "team") {
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

  const sections = [
    { id: "products", name: "Products" },
    { id: "media-config", name: "Media Configurations" },
    { id: "testimonial-content", name: "Testimonial Content About" },
    { id: "admin", name: "Admin" },
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

      {/* Horizontal Section Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-secondary-200 pb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeSection === section.id
                ? "bg-primary-600 text-white"
                : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-8">
        {/* Products Section */}
        {activeSection === "products" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Products</h3>
                <button
                  onClick={() => handleAddNew("products")}
                  className="btn-primary text-sm"
                >
                  Add Product
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(expandedProducts ? products : products.slice(0, 4)).map(
                  (product) => (
                    <div
                      key={product._id}
                      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "https://via.placeholder.com/100x75?text=No+Image"
                        }
                        alt={product.name}
                        className="w-full h-20 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-base md:text-lg truncate mb-1">
                        {product.name}
                      </h4>
                      <p className="text-secondary-600 text-sm md:text-base mb-3">
                        KSh {product.price}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product, "product")}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("product", product._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
              {products.length > 4 && (
                <button
                  onClick={() => setExpandedProducts(!expandedProducts)}
                  className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                >
                  {expandedProducts
                    ? "Show Less"
                    : `Show ${products.length - 4} More...`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Media Configurations Section */}
        {activeSection === "media-config" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Gallery</h3>
                  <button
                    onClick={() => handleAddNew("gallery")}
                    className="btn-primary text-sm"
                  >
                    Add Image
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(expandedGallery ? gallery : gallery.slice(0, 6)).map(
                    (item) => (
                      <div
                        key={item._id}
                        className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-20 object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm md:text-base truncate font-medium mb-2">
                          {item.title}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item, "gallery")}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete("gallery", item._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
                {gallery.length > 6 && (
                  <button
                    onClick={() => setExpandedGallery(!expandedGallery)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedGallery
                      ? "Show Less"
                      : `Show ${gallery.length - 6} More...`}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Videos</h3>
                  <button
                    onClick={() => handleAddNew("videos")}
                    className="btn-primary text-sm"
                  >
                    Add Video
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(expandedVideos ? videos : videos.slice(0, 4)).map(
                    (video) => (
                      <div
                        key={video._id}
                        className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <video
                          src={video.video}
                          className="w-full h-20 object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm md:text-base truncate font-medium mb-2">
                          {video.title}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(video, "video")}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete("gallery", video._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
                {videos.length > 4 && (
                  <button
                    onClick={() => setExpandedVideos(!expandedVideos)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedVideos
                      ? "Show Less"
                      : `Show ${videos.length - 4} More...`}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-medium">Categories</h3>
                  <button
                    onClick={() => handleAddNew("categories")}
                    className="btn-primary text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {(expandedCategories
                    ? categories
                    : categories.slice(0, 3)
                  ).map((category) => (
                    <div
                      key={category._id}
                      className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-sm md:text-base font-medium">
                        {category.name}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(category, "category")}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("category", category._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {categories.length > 3 && (
                  <button
                    onClick={() => setExpandedCategories(!expandedCategories)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedCategories
                      ? "Show Less"
                      : `Show ${categories.length - 3} More...`}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-medium">Units</h3>
                  <button
                    onClick={() => handleAddNew("units")}
                    className="btn-primary text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {(expandedUnits ? units : units.slice(0, 3)).map((unit) => (
                    <div
                      key={unit._id}
                      className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-sm md:text-base font-medium">
                        {unit.name}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(unit, "unit")}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("unit", unit._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {units.length > 3 && (
                  <button
                    onClick={() => setExpandedUnits(!expandedUnits)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedUnits
                      ? "Show Less"
                      : `Show ${units.length - 3} More...`}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-medium">Social Media</h3>
                  <button
                    onClick={() => handleAddNew("social-media")}
                    className="btn-primary text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {(expandedSocialMedia
                    ? socialMedia
                    : socialMedia.slice(0, 3)
                  ).map((social) => (
                    <div
                      key={social._id}
                      className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-sm md:text-base font-medium capitalize">
                        {social.platform}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(social, "social-media")}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete("social-media", social._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {socialMedia.length > 3 && (
                  <button
                    onClick={() => setExpandedSocialMedia(!expandedSocialMedia)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedSocialMedia
                      ? "Show Less"
                      : `Show ${socialMedia.length - 3} More...`}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-medium">Logos</h3>
                  <button
                    onClick={() => handleAddNew("logos")}
                    className="btn-primary text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(expandedLogos ? logos : logos.slice(0, 4)).map((logo) => (
                    <div
                      key={logo._id}
                      className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="w-full h-12 object-cover rounded-lg mb-2"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(logo, "logo")}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("logo", logo._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {logos.length > 4 && (
                  <button
                    onClick={() => setExpandedLogos(!expandedLogos)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedLogos
                      ? "Show Less"
                      : `Show ${logos.length - 4} More...`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Testimonial Content About Section */}
        {activeSection === "testimonial-content" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Testimonials</h3>
                <button
                  onClick={() => handleAddNew("testimonials")}
                  className="btn-primary text-sm"
                >
                  Add Testimonial
                </button>
              </div>
              <div className="space-y-4">
                {(expandedTestimonials
                  ? testimonials
                  : testimonials.slice(0, 3)
                ).map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-semibold text-base md:text-lg">
                        {testimonial.name}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs md:text-sm rounded-lg font-medium ${
                          testimonial.isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {testimonial.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-secondary-600 text-sm md:text-base line-clamp-2 mb-3">
                      {testimonial.message}
                    </p>
                    <div className="flex space-x-2">
                      {!testimonial.isApproved && (
                        <button
                          onClick={() =>
                            handleApproveTestimonial(testimonial._id)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(testimonial, "testimonial")}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete("testimonial", testimonial._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {testimonials.length > 3 && (
                <button
                  onClick={() => setExpandedTestimonials(!expandedTestimonials)}
                  className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                >
                  {expandedTestimonials
                    ? "Show Less"
                    : `Show ${testimonials.length - 3} More...`}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Why Choose Us</h3>
                  <button
                    onClick={() => handleAddNew("why-choose-us")}
                    className="btn-primary text-sm"
                  >
                    Add Feature
                  </button>
                </div>
                <div className="space-y-4">
                  {(expandedFeatures ? features : features.slice(0, 3)).map(
                    (feature) => (
                      <div
                        key={feature._id}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-base md:text-lg mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-secondary-600 text-sm md:text-base line-clamp-2 mb-3">
                          {feature.description}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(feature, "feature")}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete("feature", feature._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
                {features.length > 3 && (
                  <button
                    onClick={() => setExpandedFeatures(!expandedFeatures)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedFeatures
                      ? "Show Less"
                      : `Show ${features.length - 3} More...`}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">About</h3>
                  <button
                    onClick={() => handleAddNew("about")}
                    className="btn-primary text-sm"
                  >
                    Add Content
                  </button>
                </div>
                <div className="space-y-4">
                  {(expandedAbouts ? abouts : abouts.slice(0, 3)).map(
                    (about) => (
                      <div
                        key={about._id}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-semibold text-base md:text-lg capitalize">
                            {about.section}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs md:text-sm rounded-lg font-medium ${
                              about.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {about.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <h4 className="font-semibold text-base md:text-lg mb-2">
                          {about.title}
                        </h4>
                        <p className="text-secondary-600 text-sm md:text-base line-clamp-2 mb-3">
                          {about.content}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(about, "about")}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete("about", about._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
                {abouts.length > 3 && (
                  <button
                    onClick={() => setExpandedAbouts(!expandedAbouts)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedAbouts
                      ? "Show Less"
                      : `Show ${abouts.length - 3} More...`}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Team</h3>
                  <button
                    onClick={() => handleAddNew("team")}
                    className="btn-primary text-sm"
                  >
                    Add Member
                  </button>
                </div>
                <div className="space-y-4">
                  {(expandedTeam ? team : team.slice(0, 3)).map((member) => (
                    <div
                      key={member._id}
                      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-base md:text-lg">
                          {member.initials}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base md:text-lg">
                            {member.name}
                          </h4>
                          <p className="text-secondary-600 text-sm md:text-base">
                            {member.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member, "team")}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("team", member._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {team.length > 3 && (
                  <button
                    onClick={() => setExpandedTeam(!expandedTeam)}
                    className="mt-4 text-primary-600 hover:text-primary-800 text-sm md:text-base font-medium underline transition-colors"
                  >
                    {expandedTeam
                      ? "Show Less"
                      : `Show ${team.length - 3} More...`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Section */}
        {activeSection === "admin" && (
          <div className="max-w-md">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-medium mb-4">
                Credentials Management
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
                  className="w-full btn-primary opacity-50 cursor-not-allowed"
                  disabled={true}
                >
                  Update Credentials (Disabled)
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
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem
                ? `Edit ${currentFormType.slice(0, -1)}`
                : `Add New ${currentFormType.slice(0, -1)}`}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {currentFormType === "products" && (
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
                  {/* Display existing images when editing */}
                  {editingItem &&
                    editingItem.images &&
                    editingItem.images.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Current Images
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {editingItem.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Current ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
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

              {currentFormType === "testimonials" && (
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

              {currentFormType === "gallery" && (
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
                  {/* Display existing image/video when editing */}
                  {editingItem && editingItem.image && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Current Media
                      </label>
                      {editingItem.type === "video" ? (
                        <video
                          src={editingItem.video || editingItem.image}
                          className="w-full h-32 object-cover rounded border"
                          controls
                        />
                      ) : (
                        <img
                          src={editingItem.image}
                          alt="Current"
                          className="w-full h-32 object-cover rounded border"
                        />
                      )}
                    </div>
                  )}
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

              {currentFormType === "videos" && (
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
                  {/* Display existing video when editing */}
                  {editingItem && editingItem.video && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Current Video
                      </label>
                      <video
                        src={editingItem.video}
                        className="w-full h-32 object-cover rounded border"
                        controls
                      />
                    </div>
                  )}
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

              {currentFormType === "categories" && (
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

              {currentFormType === "units" && (
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

              {currentFormType === "social-media" && (
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

              {currentFormType === "logos" && (
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

              {currentFormType === "why-choose-us" && (
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

              {currentFormType === "about" && (
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

              {currentFormType === "team" && (
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
    </div>
  );
};

export default AdminDashboard;
