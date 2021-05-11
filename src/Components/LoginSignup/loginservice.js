import axios from "axios";
import hosturl from "../../Utility/APIUrl";

export const getUser = (user) => {
  return axios.get(hosturl + "/user/email/" + user.email);
};
