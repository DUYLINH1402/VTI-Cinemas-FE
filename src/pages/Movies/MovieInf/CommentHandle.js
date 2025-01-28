import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
  push,
  set,
  get,
  update,
} from "firebase/database";
import { toast } from "react-toastify";
import {
  getSubcomments,
  pushSubcomment,
  updateCommentsCount,
} from "../../../services/service/serviceMovie.js";
const userInfo = JSON.parse(localStorage.getItem("user"));

// HÀM XỬ LÝ THÊM SUBCOMMENT
export const handleAddSubcomment = async (commentId, newSubcomment) => {
  const MAX_SUBCOMMENTS_PER_USER = 3; // Số lần phản hồi tối đa
  const TIME_LIMIT = 60 * 1000; // 60 giây

  if (!newSubcomment || !newSubcomment.trim()) return;

  const newSubcommentData = {
    email: userInfo?.email,
    username: userInfo?.fullname || userInfo?.displayName,
    avatar: userInfo?.avatar || userInfo?.photoURL,
    subcontent: newSubcomment.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    // 1️. Lấy danh sách subcomments
    const subcomments = await getSubcomments(commentId);
    if (subcomments) {
      // 2️. Kiểm tra số lần phản hồi của tài khoản
      const userSubcomments = subcomments.filter(
        (sub) => sub.email === userInfo?.email
      );
      if (userSubcomments.length >= MAX_SUBCOMMENTS_PER_USER) {
        toast.warning("Bạn chỉ được phản hồi tối đa 3 bình luận!");
        return;
      }

      // 3️. Kiểm tra thời gian giữa các lần phản hồi
      if (userSubcomments.length > 0) {
        const lastSubcommentTime = new Date(
          userSubcomments[userSubcomments.length - 1].timestamp
        ).getTime();
        const now = new Date().getTime();

        if (now - lastSubcommentTime < TIME_LIMIT) {
          toast.warning("Mỗi bình luận phải cách nhau 1 phút!");
          return;
        }
      }
    }

    // 4️. Thêm subcomment mới
    const success = await pushSubcomment(commentId, newSubcommentData);
    if (!success) {
      toast.error("Không thể gửi phản hồi. Vui lòng thử lại!");
      return;
    }

    // 5️. Cập nhật commentsCount
    const updateSuccess = await updateCommentsCount(commentId);
    if (!updateSuccess) {
      toast.error("Không thể cập nhật số lượng bình luận!");
    } else {
      toast.success("Đã gửi bình luận!");
    }
  } catch (error) {
    console.error("Lỗi trong handleAddSubcomment:", error);
    toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
  }
};

//HÀM XỬ LÝ CHỈNH SỬA SUBCOMMENT
export const handleUpdateComment = async (commentId, subcommentId, newText) => {
  if (!newText.trim()) return;

  try {
    const db = getDatabase();
    const subcommentRef = ref(
      db,
      `Comments/${commentId}/subcomments/${subcommentId}`
    );

    await update(subcommentRef, { subcontent: newText });
    toast.success("Cập nhật thành công!");
    console.log("Subcomment đã được cập nhật:", subcommentId);
  } catch (error) {
    toast.error("Lỗi khi cập nhật. Vui lòng thử lại");
    console.error("Lỗi khi cập nhật subcomment:", error);
  }
};
