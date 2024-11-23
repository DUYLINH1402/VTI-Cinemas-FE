export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // Thêm file ảnh vào formData
  formData.append("upload_preset", "  VTICinemas_avatar"); // Thay bằng tên preset bạn đã tạo
  formData.append("folder", "avatarUser"); // (Tùy chọn) Thêm folder để quản lý

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/ddia5yfia/image/upload`, // Thay <your-cloud-name> bằng Cloud name
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload ảnh thất bại");
  }

  const data = await response.json();
  return data.secure_url; // URL ảnh sau khi upload thành công
};
