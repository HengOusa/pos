export const setAccessToken = (value) => {
  localStorage.setItem("access_token", value);
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

// localStorage cannot store object but can store string object
export const setProfile = (value) => {
  localStorage.setItem("profile", JSON.stringify(value));
};

export const getProfile = () => {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
};

export const clearProfile = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
};
