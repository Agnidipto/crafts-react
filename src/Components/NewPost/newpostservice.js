import axios from "axios";

import hosturl from "../../Utility/APIUrl";

export const post = async (files, text, user) => {
  var fd = new FormData();
  fd.append("name", text.name);
  fd.append("description", text.desc);

  fd.append("file1", await x(files.file1, "file1"));

  fd.append("file2", await x(files.file2, "file2"));

  fd.append("file3", await x(files.file3, "file3"));

  return axios({
    method: "post",
    url: hosturl + "/user/" + user.userId + "/newpost",
    data: fd,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

async function x(image, name) {
  if (image === null) return null;
  const config = { responseType: "blob" };
  var file = null;
  const response = await axios.get(image, config);
  file = new File([response.data], name, { type: response.data.type });
  return file;
}
