import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [locationInput, setLocationInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    story: "",
    visitedLocation: [],
    imageUrl: "",
    visitedDate: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ FETCH FIXED
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axiosInstance.get(`/get-travel-story/${id}`);
        const s = res.data.story;

        setForm({
          title: s.title || "",
          story: s.story || "",
          // 🔥 FIX: string → array
          visitedLocation: s.visitedLocation
            ? s.visitedLocation.split(", ").map((l) => l.trim())
            : [],
          imageUrl: s.imageUrl || "",
          visitedDate: s.visitedDate
            ? new Date(s.visitedDate).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        toast.error("Failed to load story");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    fetchStory();
  }, [id]);

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

  // ✅ SUBMIT FIXED
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
        // 🔥 FIX: array → string
        visitedLocation: form.visitedLocation.join(", "),
      };

      await axiosInstance.put(`/edit-story/${id}`, payload);

      toast.success("Story updated successfully!");

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update story");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center mt-20 text-gray-400">
          Loading story...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Edit Story ✏️</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl border space-y-4"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Title"
          />

          <input
            type="date"
            name="visitedDate"
            value={form.visitedDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* LOCATION */}
          <div>
            <div className="flex gap-2">
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={addLocation}
                className="bg-blue-500 text-white px-4 rounded"
              >
                Add
              </button>
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
              {form.visitedLocation.map((loc, i) => (
                <span
                  key={i}
                  className="bg-cyan-100 px-3 py-1 rounded-full text-sm"
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
          </div>

          <textarea
            name="story"
            value={form.story}
            onChange={handleChange}
            rows={5}
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded">
            {loading ? "Updating..." : "Update Story"}
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default EditStory;