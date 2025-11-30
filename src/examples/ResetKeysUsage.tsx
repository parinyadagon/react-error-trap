import { ErrorBoundary } from "@parinyadagon/react-error-trap";
import { useState } from "react";

const UserProfile = ({ userId }: { userId: number }) => {
  if (userId === 2) {
    throw new Error(`Failed to load profile for User ID: ${userId}`);
  }
  return (
    <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #86efac" }}>
      <h4>User Profile: {userId}</h4>
      <p>Name: User {userId}</p>
      <p>Status: Active</p>
    </div>
  );
};

export const ResetKeysUsage = () => {
  const [userId, setUserId] = useState(1);

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>4. ResetKeys Pattern</h2>
      <div className="card">
        <h3>User Profile Viewer</h3>
        <p>
          Try switching to <strong>User 2</strong> (It will crash). Then switch to <strong>User 1</strong> or <strong>3</strong> to see auto-recovery.
        </p>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button onClick={() => setUserId(1)} disabled={userId === 1}>
            User 1
          </button>
          <button onClick={() => setUserId(2)} disabled={userId === 2}>
            User 2 (Error)
          </button>
          <button onClick={() => setUserId(3)} disabled={userId === 3}>
            User 3
          </button>
        </div>

        <div style={{ minHeight: "150px" }}>
          <ErrorBoundary
            mode="inline"
            resetKeys={[userId]} // Auto-reset when userId changes
            onReset={() => console.log("Boundary reset because userId changed!")}>
            <UserProfile userId={userId} />
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
};
