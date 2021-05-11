import axios from "axios";
import hosturl from "../../Utility/APIUrl";

function updateProfile(user) {
  return axios.put(hosturl + "/user/" + user.userId + "/update", user);
}

export const getUserInfo = (id) => {
  return axios.get(hosturl + "/user/" + id + "/info");
};

export const getUser = (user) => {
  return axios.get(hosturl + "/user/" + user.userId);
};

export default updateProfile;
