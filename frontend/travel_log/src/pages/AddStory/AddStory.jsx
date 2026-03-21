import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddStory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    story: "",
    visitedLocation: [],
    imageUrl: "",
    visitedDate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const addLocation = () => {
    const loc = locationInput.trim();
    if (!loc) return;

    if (form.visitedLocation.includes(loc)) {
      toast.error("Location already added");
      return;
    }

    setForm({
      ...form,
      visitedLocation: [...form.visitedLocation, loc],
    });

    setLocationInput("");
  };

  const removeLocation = (loc) => {
    setForm({
      ...form,
      visitedLocation: form.visitedLocation.filter((l) => l !== loc),
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.story.trim()) errs.story = "Story is required";
    if (!form.visitedDate) errs.visitedDate = "Date is required";
    if (form.visitedLocation.length === 0)
      errs.visitedLocation = "Add at least one location";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        visitedLocation: form.visitedLocation.join(", "),
      };

      await axiosInstance.post("/add-travel-story", payload);

      toast.success("Story added successfully!");

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 mb-2"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Add New Story
          </h1>

          <p className="text-sm text-gray-500">
            Document your travel memories
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border space-y-5"
        >
          {/* TITLE */}
          <div>
            <label className="text-sm font-semibold">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-semibold">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />

            {/* NEW: IMAGE PREVIEW */}
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-full h-40 object-cover rounded mt-3"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/400x200?text=Invalid+Image")
                }
              />
            )}
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm font-semibold">Visit Date *</label>
            <input
              type="date"
              name="visitedDate"
              value={form.visitedDate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
            {errors.visitedDate && (
              <p className="text-xs text-red-500">
                {errors.visitedDate}
              </p>
            )}
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm font-semibold">
              Visited Locations *
            </label>

            <div className="flex gap-2 mt-1">
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
              />
              <button
                type="button"
                onClick={addLocation}
                className="bg-blue-500 text-white px-4 rounded-md"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {form.visitedLocation.map((loc, i) => (
                <span
                  key={i}
                  className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs"
                >
                  {loc}
                  <button
                    type="button"
                    onClick={() => removeLocation(loc)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {errors.visitedLocation && (
              <p className="text-xs text-red-500">
                {errors.visitedLocation}
              </p>
            )}
          </div>

          {/* STORY */}
          <div>
            <label className="text-sm font-semibold">Story *</label>
            <textarea
              name="story"
              value={form.story}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
            {errors.story && (
              <p className="text-xs text-red-500">{errors.story}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md"
            >
              {loading ? "Saving..." : "Save Story"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 border rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AddStory;