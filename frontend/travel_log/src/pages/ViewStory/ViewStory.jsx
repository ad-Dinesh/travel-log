import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { MdEdit, MdDelete } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewStory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchStory = async () => {
    try {
      const res = await axiosInstance.get(`/get-travel-story/${id}`);
      setStory(res.data.story);
    } catch (err) {
      toast.error("Failed to load story");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStory(); }, [id]);

  const toggleFavourite = async () => {
    const updated = { ...story, isFavourite: !story.isFavourite };
    setStory(updated);
    try {
      await axiosInstance.put(`/update-isFavorite/${id}`, {
        isFavourite: updated.isFavourite,
      });
      toast.success(updated.isFavourite ? "Added to favourites!" : "Removed from favourites");
    } catch (err) {
      setStory(story);
      toast.error("Failed to update favourite");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/delete-story/${id}`);
      toast.success("Story deleted");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error("Failed to delete story");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af", fontSize: "16px" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "13px", color: "#6b7280", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "4px", padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            backgroundColor: "#fff", borderRadius: "16px",
            border: "1px solid #e5e7eb", overflow: "hidden",
          }}
        >
          {/* HERO IMAGE */}
          <div style={{ position: "relative", width: "100%", height: "360px" }}>
            <img
              src={story.imageUrl || "https://via.placeholder.com/800x360?text=Travel+Story"}
              alt={story.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "120px",
                background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
              }}
            />
            {/* FAVOURITE BUTTON */}
            <button
              onClick={toggleFavourite}
              style={{
                position: "absolute", top: "16px", right: "16px",
                width: "44px", height: "44px", borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <FaHeart
                style={{ fontSize: "18px", color: story.isFavourite ? "#ef4444" : "#d1d5db" }}
              />
            </button>
          </div>

          {/* CONTENT */}
          <div style={{ padding: "32px" }}>

            {/* TITLE + DATE */}
            <div style={{ marginBottom: "16px" }}>
              <h1
                style={{
                  margin: "0 0 8px 0", fontSize: "28px",
                  fontWeight: "700", color: "#111827", lineHeight: 1.3,
                }}
              >
                {story.title}
              </h1>
              <p style={{ margin: 0, fontSize: "14px", color: "#9ca3af" }}>
                📅{" "}
                {story.visitedDate
                  ? new Date(story.visitedDate).toLocaleDateString("en-GB", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric",
                    })
                  : "Date not specified"}
              </p>
            </div>

            {/* LOCATIONS */}
            {story.visitedLocation && story.visitedLocation.length > 0 && (
              <div
                style={{
                  display: "flex", flexWrap: "wrap", gap: "8px",
                  marginBottom: "24px",
                }}
              >
                {story.visitedLocation.map((loc, i) => (
                  <span
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      fontSize: "13px", color: "#06b6d4",
                      backgroundColor: "#ecfeff", border: "1px solid #a5f3fc",
                      borderRadius: "999px", padding: "5px 14px", fontWeight: "500",
                    }}
                  >
                    <GrMapLocation style={{ fontSize: "12px" }} />
                    {loc}
                  </span>
                ))}
              </div>
            )}

            {/* DIVIDER */}
            <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", marginBottom: "24px" }} />

            {/* STORY TEXT */}
            <p
              style={{
                fontSize: "16px", color: "#374151",
                lineHeight: "1.8", whiteSpace: "pre-wrap", margin: "0 0 32px 0",
              }}
            >
              {story.story}
            </p>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate(`/edit-story/${id}`)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 24px", backgroundColor: "#eff6ff", color: "#3b82f6",
                  border: "1px solid #bfdbfe", borderRadius: "10px",
                  cursor: "pointer", fontSize: "14px", fontWeight: "500",
                }}
              >
                <MdEdit style={{ fontSize: "16px" }} /> Edit Story
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 24px", backgroundColor: "#fef2f2", color: "#ef4444",
                  border: "1px solid #fecaca", borderRadius: "10px",
                  cursor: "pointer", fontSize: "14px", fontWeight: "500",
                }}
              >
                <MdDelete style={{ fontSize: "16px" }} /> Delete Story
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteModal && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(false)}
        />
      )}
      <ToastContainer position="bottom-right" autoClose={2500} />
    </div>
  );
};

export default ViewStory;