import axios from "axios";
import hosturl from "../../Utility/APIUrl";

function postImage(image) {
  const user = JSON.parse(localStorage.getItem("user"));

  var fd = new FormData();
  fd.append("file", image);

  return axios({
    method: "post",
    url: hosturl + "/user/profileimage/" + user.userId,
    data: fd,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const getUserInfo = (id) => {
  return axios.get(hosturl + "/user/" + id + "/info");
};

export default postImage;
