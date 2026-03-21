const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "#fff", borderRadius: "16px",
          padding: "32px", maxWidth: "420px", width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ICON */}
        <div
          style={{
            width: "56px", height: "56px", borderRadius: "50%",
            backgroundColor: "#fef2f2",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "24px",
          }}
        >
          🗑️
        </div>

        <h2
          style={{
            margin: "0 0 8px 0", fontSize: "20px",
            fontWeight: "700", color: "#111827", textAlign: "center",
          }}
        >
          Delete this story?
        </h2>
        <p
          style={{
            margin: "0 0 28px 0", fontSize: "14px",
            color: "#6b7280", textAlign: "center", lineHeight: "1.5",
          }}
        >
          This action cannot be undone. Your travel story will be permanently removed.
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "11px 0",
              backgroundColor: "#f3f4f6", color: "#374151",
              border: "1px solid #e5e7eb", borderRadius: "10px",
              cursor: "pointer", fontSize: "14px", fontWeight: "500",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "11px 0",
              backgroundColor: "#ef4444", color: "#fff",
              border: "none", borderRadius: "10px",
              cursor: "pointer", fontSize: "14px", fontWeight: "600",
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;