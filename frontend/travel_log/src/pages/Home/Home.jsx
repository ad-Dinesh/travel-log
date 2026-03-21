import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [showFav, setShowFav] = useState(false);
  const [sortType, setSortType] = useState("latest");

  const getAllStories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/get-all-travel-stories");
      setAllStories(res.data.stories || []);
    } catch {
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id) => {
    try {
      await axiosInstance.delete(`/delete-story/${id}`);
      setAllStories((prev) => prev.filter((s) => s._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleFavourite = async (id, current) => {
    setAllStories((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, isFavorite: !current } : s
      )
    );

    try {
      await axiosInstance.put(`/update-isFavorite/${id}`, {
        isFavorite: !current,
      });
    } catch {
      setAllStories((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isFavorite: current } : s
        )
      );
    }
  };

  useEffect(() => {
    getAllStories();
  }, []);

  let filteredStories = [...allStories];

  if (search) {
    filteredStories = filteredStories.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (showFav) {
    filteredStories = filteredStories.filter((s) => s.isFavorite);
  }

  filteredStories.sort((a, b) =>
    sortType === "latest"
      ? new Date(b.visitedDate) - new Date(a.visitedDate)
      : new Date(a.visitedDate) - new Date(b.visitedDate)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-md"
          />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button
            onClick={() => setShowFav(!showFav)}
            className={`px-4 py-2 rounded-md ${
              showFav ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            ⭐ Favourites
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}

        {!loading && filteredStories.length === 0 && (
          <p className="text-center text-gray-400">No stories</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <TravelStoryCard
              key={story._id}
              _id={story._id}
              imgUrl={story.imageUrl}
              title={story.title}
              date={story.visitedDate}
              story={story.story}
              visitedLocation={story.visitedLocation}
              isFavorite={story.isFavorite}  // 🔥 FIX
              onFavouriteClick={() =>
                toggleFavourite(story._id, story.isFavorite)
              }
              onDelete={() => deleteStory(story._id)}
            />
          ))}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;