// Storage utilities
export const setServerStatus = (status) => {
  try {
    localStorage.setItem("server_status", String(status));
  } catch (error) {
    console.error("Failed to set server status:", error);
  }
};

export const getServerStatus = () => {
  try {
    return localStorage.getItem("server_status");
  } catch (error) {
    console.error("Failed to get server status:", error);
    return null;
  }
};

export const clearServerStatus = () => {
  try {
    localStorage.removeItem("server_status");
  } catch (error) {
    console.error("Failed to clear server status:", error);
  }
};
