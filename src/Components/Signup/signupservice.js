import axios from "axios";
import hosturl from "../../Utility/APIUrl";

const signup = (user) => {
  return axios.post(hosturl + "/users", user);
};

export const checkIfEmailExists = (user) => {
  return axios.get(hosturl + "/user/email/" + user.email);
};

export const getUserInfo = (id) => {
  return axios.get(hosturl + "/user/" + id + "/info");
};

export default signup;
