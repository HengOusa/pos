import dayjs from "dayjs";
import { useProfileStore } from "../Stores/profileStore";

export const dateClient = (date, format = "DD-MM-YYYY") => {
  if (date) {
    return dayjs(date).format(format);
  }
  return null;
};

export const isPermissionAction = (permission_name) => {
  const { permission } = useProfileStore.getState();
  if (permission) {
    let findIndex = permission?.findIndex(
      (item) => item.name == permission_name
    );
    if (findIndex == -1) {
      return false;
    } else {
      return true;
    }
  }
};
