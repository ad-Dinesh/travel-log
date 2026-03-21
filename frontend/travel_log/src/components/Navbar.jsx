import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearch, onClearSearch }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleClear = () => {
    if (setSearchQuery) setSearchQuery("");
    if (onClearSearch) onClearSearch();
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "64px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LOGO */}
      <div
        onClick={() => navigate("/dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "22px" }}></span>
        <span
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0ea5e9",
            letterSpacing: "-0.5px",
          }}
        >
          Travel Log
        </span>
      </div>

      {/* SEARCH BAR (only shown when props passed) */}
      {setSearchQuery !== undefined && (
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: "0 1 380px",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search stories or locations..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 36px 8px 36px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                color: "#111827",
                backgroundColor: "#f9fafb",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#0ea5e9",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              whiteSpace: "nowrap",
            }}
          >
            Search
          </button>
        </form>
      )}

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {userInfo && (
          <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
            {userInfo.fullName}
          </span>
        )}
        <button
          onClick={() => navigate("/add-story")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0ea5e9",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          + Add Story
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            color: "#ef4444",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;