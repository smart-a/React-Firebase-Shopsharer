import React from "react";
import * as db from "../firestore";

function useAuth() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    return db.checkAuth((user) => {
      setLoading(false);
      const { uid, displayName } = user;
      setUser({ uid, displayName });
    });
  }, []);

  return { user, loading };
}

export default useAuth;
