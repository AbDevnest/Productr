const succeesResponse = (res, message, data = {}) => {
  return res.status(200).json({ status: true, message, data });
};

const createResponse = (res) => {
  return res
    .status(201)
    .json({ status: true, message: "Created Successfully" });
};

const updateResponse = (res) => {
  return res
    .status(200)
    .json({ status: true, message: "Updated Successfully" });
};

const deleteResponse = (res) => {
  return res
    .status(200)
    .json({ status: true, message: "Deleted Successfully" });
};

const allFields_Response = (res) => {
  return res
    .status(400)
    .json({ status: false, message: "All fields are required" });
};

const notFound_Response = (res, message = "Not Found") => {
  return res.status(404).json({ status: false, message });
};

const serverError_Response = (res) => {
  return res.status(500).json({ status: false, message: "Server Error" });
};

const alreadyExist_Response = (res) => {
  return res.status(409).json({ status: false, message: "Already Exists" });
};

module.exports = {
  succeesResponse,
  createResponse,
  updateResponse,
  deleteResponse,
  allFields_Response,
  notFound_Response,
  serverError_Response,
  alreadyExist_Response,
};
