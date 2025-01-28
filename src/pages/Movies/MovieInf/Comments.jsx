import React, { useState, useEffect, useRef } from "react";
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
import comment_icon from "../../../assets/icon/comment_icon.svg";
import like_icon from "../../../assets/icon/like_icon.svg";
import edit_icon from "../../../assets/icon/edit_icon.svg";
import TagSelector from "./TagSelector";
import useAutosizeTextarea from "../../../utils/utilsFunction";
import { toast } from "react-toastify";
import { uploadImageComments } from "../../../services/service/serviceUploadImage.js";
import LazyImage from "../../../components/LazyImage.jsx";
import RenderRatingStars from "./RatingStars.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { fetchMoviesByIdFromFirebase } from "../../../services/firebase/firebaseMovie.js";
import { LoadingScreen } from "../../../components/Loading/LoadingScreen.jsx";
import LoadingIcon from "../../../components/LoadingIcon.jsx";
import { CSSTransition } from "react-transition-group";
import { handleAddSubcomment, handleUpdateComment } from "./CommentHandle.js";
const Comments = ({ movieId }) => {
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái hệ thống đang xử lý
  const [hasRated, setHasRated] = useState(false); // Trạng thái đã gửi đánh giá
  const [rating, setRating] = useState(0); // Lưu điểm đánh giá
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [comments, setComments] = useState([]); // Lưu danh sách bình luận của phim hiện tại
  const [newComment, setNewComment] = useState(""); // Nội dung bình luận mới
  const [canComment, setCanComment] = useState(false); // Trạng thái kiểm tra quyền bình luận
  const [selectedTags, setSelectedTags] = useState([]); // Danh sách thẻ cảm xúc
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng
  const textareaRef = useRef(null);
  const actionsRef = useRef(null); // Tham chiếu đến phần mở rộng
  const containerRef = useRef(null); // Tham chiếu đến toàn bộ "cục" này
  const [visibleSubcomments, setVisibleSubcomments] = useState({}); // Trạng thái lưu subcomments của từng comment
  const subcommentsRefs = useRef({}); // Sử dụng đối tượng ref thay vì một ref chung
  const [editingSubcommentId, setEditingSubcommentId] = useState({
    commentId: null,
    subcommentId: null,
  });
  // Chỉ lưu ID subcomment đang chỉnh sửa
  const [editText, setEditText] = useState(""); // Lưu nội dung chỉnh sửa

  const toggleSubcomments = (commentId) => {
    // console.log("Trạng thái trước:", visibleSubcomments[commentId]);
    setVisibleSubcomments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Đảo ngược trạng thái
    }));
    // console.log("Trạng thái sau:", !visibleSubcomments[commentId]);
  };
  const [newSubcomment, setNewSubcomment] = useState("");
  // Xử lý khi click vào textarea
  const handleTextareaClick = () => {
    setIsExpanded(true); // Hiện các phần mở rộng khi click vào textarea
  };
  // Xử lý khi click bên ngoài để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) // Nếu click ra ngoài container
      ) {
        // Kiểm tra nếu event.target có thuộc về bất kỳ subcomments nào không
        const isClickOnSubcomments = Object.values(
          subcommentsRefs.current
        ).some((subRef) => subRef && subRef.contains(event.target));

        if (!isClickOnSubcomments) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sử dụng hook để tự động thay đổi chiều cao textarea từ utilsFunction
  useAutosizeTextarea(textareaRef, newComment);

  // Định dạng ngày tháng
  const formatDate = (timestamp) => {
    const date = new Date(timestamp); // Chuyển timestamp thành đối tượng Date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}  ${hours}:${minutes}`;
  };

  // LƯU ẢNH VÀO CLOUDINARY
  const [image, setImage] = useState(null); // Lưu trữ file ảnh Comment
  const [previewImage, setPreviewImage] = useState(null); // Lưu URL tạm thời để hiển thị ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("File được chọn:", file); // Log để kiểm tra file
    if (file) {
      setImage(file); // Lưu file ảnh vào state
      setPreviewImage(URL.createObjectURL(file)); // Tạo URL tạm thời để hiển thị
    }
  };
  // Hàm xử lý khi người dùng xóa ảnh
  const handleRemoveImage = () => {
    setImage(null); // Xóa file ảnh khỏi state
    setPreviewImage(null); // Xóa URL xem trước
  };
  // Reset các state liên quan đến bình luận khi movieId hoặc movieName thay đổi
  useEffect(() => {
    setNewComment(""); // Reset nội dung bình luận
    setSelectedTags([]); // Reset các tag được chọn
    setImage(null); // Reset ảnh
    setPreviewImage(null); // Reset preview ảnh
    setRating(0); // Reset điểm đánh giá
    setHasRated(false); // Reset trạng thái đã đánh giá
  }, [movieId]);

  // Kiểm tra đã bình luận hay chưa
  useEffect(() => {
    const checkHasRated = async () => {
      if (!userInfo?.email || !movieId) return;
      const db = getDatabase();
      const commentsRef = ref(db, "Comments");
      const commentsQuery = query(
        commentsRef,
        orderByChild("email_movieId"),
        equalTo(`${userInfo.email}_${movieId}`)
      );

      try {
        const snapshot = await get(commentsQuery);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Kiểm tra từng bình luận để chắc chắn đúng email và movieId
          const hasRatedAccurately = Object.values(data).some(
            (comment) =>
              comment.email === userInfo.email &&
              comment.movieId === String(movieId)
          );

          if (hasRatedAccurately) {
            setHasRated(true); // Đánh dấu trạng thái đã gửi
            setCanComment(false); // Vô hiệu hóa bình luận nếu đã gửi
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đánh giá:", error);
      }
    };

    checkHasRated();
  }, [userInfo, movieId]);

  // Kiểm tra quyền bình luận
  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, "Orders");
    if (!userInfo?.email) {
      setCanComment(false);
      return;
    }
    const ordersQuery = query(
      ordersRef,
      orderByChild("app_user"),
      equalTo(userInfo.email) // Tìm các đơn hàng của người dùng dựa trên email
    );
    const unsubscribe = onValue(ordersQuery, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("Không có giao dịch nào!");
        setCanComment(false);
        return;
      }
      let hasOrder = false;
      snapshot.forEach((order) => {
        const data = order.val();
        if (
          data.movieDetails?.movie_id === movieId &&
          data.status === "success"
        ) {
          hasOrder = true;
        }
      });
      setCanComment(hasOrder);
    });
    return () => unsubscribe();
  }, [userInfo, movieId]);

  // Lấy dữ liệu phim từ database
  const [movieData, setMovieData] = useState(null);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoadingMovie(true);
      try {
        const movie = await fetchMoviesByIdFromFirebase(movieId);
        if (movie) {
          setMovieData(movie);
        } else {
          console.warn(`Không tìm thấy phim với movieId: ${movieId}`);
          setMovieData(null);
        }
        // console.log("movieData", movie);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phim:", error);
      } finally {
        setIsLoadingMovie(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  // Lấy danh sách bình luận
  useEffect(() => {
    setIsLoadingComments(true); // Bật trạng thái loading trước khi bắt đầu
    if (!movieId) {
      setIsLoadingComments(false); // Tắt trạng thái nếu không có movieId
      return;
    }

    const db = getDatabase();
    const commentsRef = ref(db, "Comments");
    const commentsQuery = query(
      commentsRef,
      orderByChild("movieId"),
      equalTo(String(movieId)) // Đảm bảo movieId là chuỗi
    );

    const unsubscribe = onValue(
      commentsQuery,
      (snapshot) => {
        if (!snapshot.exists()) {
          setComments([]); // Nếu không có bình luận, đặt danh sách bình luận rỗng
        } else {
          // Xử lý dữ liệu bình luận từ snapshot
          const data = snapshot.val();
          const fetchedComments = Object.entries(data)
            .map(([id, value]) => ({
              id,
              ...value,
              timestamp: new Date(value.timestamp).getTime(),
            }))
            .sort((a, b) => b.timestamp - a.timestamp); // Sắp xếp giảm dần theo thời gian
          setComments(fetchedComments); // Cập nhật danh sách bình luận
        }
        setIsLoadingComments(false); // Tắt trạng thái loading sau khi xử lý xong
      },
      (error) => {
        console.error("Lỗi khi tải bình luận:", error);
        setIsLoadingComments(false); // Tắt trạng thái loading khi xảy ra lỗi
      }
    );

    return () => unsubscribe(); // Hủy lắng nghe khi component unmount
  }, [movieId]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Thêm bình luận mới
  const handleAddComment = async () => {
    if (rating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (!newComment.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }
    if (newComment.length < minCharacters) {
      toast.warning(`Bình luận phải có ít nhất ${minCharacters} ký tự!`);
      return;
    }
    if (selectedTags.length === 0) {
      toast.warning("Vui lòng chọn cảm xúc của bạn!");
      return;
    }
    // setIsLoading(true); // Bật trạng thái loading
    setIsSubmitting(true); // Bật trạng thái loading
    let imageUrl = null;
    if (image) {
      try {
        // Gọi hàm uploadImageComments
        imageUrl = await uploadImageComments(image);
        console.log("URL ảnh đã tải lên:", imageUrl);
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
        toast.warning("Không thể tải ảnh lên. Vui lòng thử lại!");
        return;
      }
    }
    // Tạo tham chiếu đến bảng Comments
    const db = getDatabase();
    const commentsRef = ref(db, "Comments");
    const commentsQuery = query(
      commentsRef,
      orderByChild("email_movieId"),
      equalTo(`${userInfo?.email}_${movieId}`)
    );

    setIsLoading(true); // Bật trạng thái loading
    const formattedDate = formatDate(Date.now());

    // Dữ liệu cần lưu
    const commentData = {
      email: userInfo?.email, // Lưu email thay vì userId
      email_movieId: `${userInfo?.email}_${movieId}`, // Khóa duy nhất kết hợp email và movieId
      purchased: canComment, // Lưu trạng thái đã mua vé
      username: userInfo?.fullname || userInfo?.displayName,
      avatar: userInfo?.avatar || userInfo?.photoURL,
      content: newComment,
      tags: selectedTags, // Danh sách thẻ cảm xúc
      image: imageUrl || null, // Lưu URL ảnh nếu có
      timestamp: Date.now(), // Lưu timestamp dạng số
      movieId: String(movieId),
      likes: 0, // Mặc định 0 lượt thích
      commentsCount: 0, // Mặc định 0 bình luận phản hồi
      rating: rating * 2, // Lưu điểm đánh giá
    };
    // console.log("Bình luận gửi đi:", commentData);
    try {
      // Kiểm tra nếu đã có bình luận cho phim này
      const snapshot = await get(commentsQuery);
      if (snapshot.exists()) {
        // toast.warning("Bạn đã gửi đánh giá cho phim này!");
        setHasRated(true);
        return;
      }
      const newCommentRef = push(commentsRef);
      await set(newCommentRef, commentData);

      // Cập nhật tổng điểm và số lượt đánh giá cho phim
      const movie = await fetchMoviesByIdFromFirebase(movieId);

      if (movie) {
        const totalRatings = (movie.totalRatings || 0) + commentData.rating;
        const totalReviews = (movie.totalReviews || 0) + 1;
        const averageRating = parseFloat(
          (totalRatings / totalReviews).toFixed(1)
        );

        const movieRef = ref(db, `Movies/movie${movieId}`);
        await update(movieRef, {
          totalRatings,
          totalReviews,
          rating: averageRating, // Cập nhật điểm trung bình
        });
      }
      // Reset các state sau khi gửi bình luận
      setHasRated(true); // Đánh dấu trạng thái đã gửi đánh giá
      setNewComment("");
      setRating(0); // Reset điểm đánh giá
      setSelectedTags([]);
      setImage(null);
      setPreviewImage(null);
      toast.success("Bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      toast.error("Không thể gửi bình luận. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false); // Tắt trạng thái loading
    }
  };
  const maxCharacters = 300; // Giới hạn số ký tự
  const minCharacters = 10; // Giới hạn ký tự tối thiểu
  return (
    <div className="comment-wrapper">
      {/* Nếu người dùng đã gửi đánh giá */}
      {hasRated && <p className="info">Bạn đã gửi đánh giá cho phim này!</p>}
      {/* Nếu người dùng không có quyền bình luận */}
      {!canComment && !hasRated && (
        <p className="info">Bạn cần mua vé để gửi đánh giá phim!</p>
      )}
      <div className="comments-section" ref={containerRef}>
        {/* Chỉ hiển thị phần đánh giá và bình luận nếu có quyền và chưa gửi */}
        {canComment && !hasRated && (
          <>
            {/* Giao diện đánh giá sao */}
            <div className="rating-section">
              <p className="title">Đánh giá và bình luận phim</p>
              <RenderRatingStars
                rating={rating} // Truyền điểm đánh giá
                onRatingSelect={(selectedRating) => setRating(selectedRating)}
                disabled={isLoading || hasRated} // Vô hiệu hóa nếu loading hoặc đã gửi đánh giá
              />
            </div>
            {/* Giao diện nhập bình luận */}
            <textarea
              ref={textareaRef}
              style={{
                overflow: "hidden",
                resize: "none",
              }}
              placeholder={`Hãy chia sẻ cảm xúc của bạn... (tối thiểu ${minCharacters} ký tự)`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={maxCharacters}
              onClick={handleTextareaClick}
            ></textarea>
            <CSSTransition
              in={isExpanded} // Kiểm soát hiển thị theo trạng thái mở rộng
              timeout={500} // Thời gian hiệu ứng
              classNames="comments-expand"
              unmountOnExit
            >
              <div className="comments-actions-wrapper">
                <div className="comment-actions" ref={actionsRef}>
                  {/* Nút tải ảnh */}
                  <div className="image-upload-section">
                    <label htmlFor="file-upload" className="custom-upload-btn">
                      Tải ảnh lên
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    {previewImage && (
                      <div className="image-preview">
                        <LazyImage src={previewImage} alt="Preview" />
                        <button
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    )}
                  </div>
                  <TagSelector
                    onSelectTags={(tags) => setSelectedTags(tags)}
                    selectedTags={selectedTags}
                  />
                  {/* Nút gửi bình luận */}
                  <button
                    className="send-comment-btn"
                    onClick={handleAddComment}
                    disabled={isLoading || hasRated || !canComment}
                  >
                    {isSubmitting ? (
                      <LoadingIcon size="2rem" color="white" />
                    ) : (
                      "Gửi"
                    )}
                  </button>
                </div>
              </div>
            </CSSTransition>
          </>
        )}
        <div className="movie-rating">
          {isLoadingMovie ? (
            <LoadingScreen message="Đang tải đánh giá phim..." />
          ) : (
            movieData && (
              <div>
                <FontAwesomeIcon icon={solidStar} className="star" />
                <span className="core">{movieData.rating || 0}/10</span> ·{" "}
                <span>{movieData.totalReviews || 0} lượt đánh giá</span>
              </div>
            )
          )}
        </div>
        <p className="title">Bình luận từ người xem</p>
        <div className="comments-list">
          {isLoadingComments ? (
            <LoadingScreen message="Đang tải bình luận..." />
          ) : comments.length === 0 ? (
            <p className="paragraph">Chưa có bình luận nào!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <LazyImage
                    src={comment.avatar}
                    alt={comment.username}
                    width="40px"
                    height="40px"
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <p className="username">{comment.username}</p>
                    <p className="timestamp">{formatDate(comment.timestamp)}</p>
                  </div>
                  {comment.purchased && (
                    <span className="verified-badge">Đã xem phim</span>
                  )}
                </div>
                <p className="user-rating">
                  <FontAwesomeIcon icon={solidStar} /> {comment.rating || 0}/10
                </p>
                <p className="content-comment">{comment.content}</p>
                <div className="tags">
                  {comment.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                {comment.image && (
                  <LazyImage
                    src={comment.image}
                    alt="Ảnh bình luận"
                    className="comment-image"
                  />
                )}
                <div className="actions">
                  <span className="comment-count">
                    <img src={comment_icon} alt="" className="actions_icon" />
                    {/* Nút ẩn/hiện bình luận */}
                    <span
                      onClick={() => toggleSubcomments(comment.id)}
                      className="toggle-button"
                    >
                      {visibleSubcomments[comment.id]
                        ? "Ẩn bình luận"
                        : `${comment.commentsCount} Bình luận`}
                    </span>
                  </span>
                  <span>
                    <img src={like_icon} alt="" className="actions_icon" />{" "}
                    {comment.likes} Thích
                  </span>
                </div>
                <CSSTransition
                  in={!!visibleSubcomments[comment.id]} // Chỉ mở khi trạng thái của comment.id là true
                  timeout={1000}
                  classNames="subcomments"
                  unmountOnExit
                >
                  {/* Hiển thị danh sách subcomments */}
                  <div
                    ref={(el) => {
                      subcommentsRefs.current[comment.id] = el;
                    }} // Gán ref cho từng bình luận
                    className="subcomments-container"
                  >
                    <div
                      className={`subcomments ${
                        visibleSubcomments[comment.id] ? "visible" : ""
                      }`}
                    >
                      {comment.subcomments &&
                        Object.entries(comment.subcomments).map(
                          ([subcommentId, sub]) => (
                            <div key={subcommentId} className="subcomment">
                              <div className="comment-header">
                                <div>
                                  <LazyImage
                                    src={sub.avatar}
                                    alt={sub.username}
                                    width="40px"
                                    height="40px"
                                    className="user-avatar"
                                  />
                                </div>
                                <div>
                                  <div className="user-info">
                                    <p className="username">{sub.username}</p>
                                    <p className="timestamp">
                                      {formatDate(sub.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="content-subcomment">
                                {sub.subcontent}
                              </div>
                              {/* Kiểm tra xem comment này có đang được chỉnh sửa không */}
                              {editingSubcommentId.commentId === comment.id &&
                              editingSubcommentId.subcommentId ===
                                subcommentId ? (
                                <div className="edit-subComment-wrapper">
                                  <textarea
                                    className="edit-subComment"
                                    value={editText}
                                    onChange={(e) =>
                                      setEditText(e.target.value)
                                    }
                                  />
                                  <button
                                    className="btn-actions btn-accept"
                                    onClick={() => {
                                      handleUpdateComment(
                                        comment.id,
                                        subcommentId,
                                        editText
                                      );
                                      setEditingSubcommentId({
                                        commentId: null,
                                        subcommentId: null,
                                      }); // Đóng chế độ chỉnh sửa
                                      setEditText(""); // Xóa nội dung chỉnh sửa
                                    }}
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    className="btn-actions btn-cancle"
                                    onClick={() => {
                                      setEditingSubcommentId({
                                        commentId: null,
                                        subcommentId: null,
                                      }); // Hủy chỉnh sửa
                                      setEditText(""); // Reset nội dung
                                    }}
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                userInfo?.email === sub.email && (
                                  <button
                                    onClick={() => {
                                      setEditingSubcommentId({
                                        commentId: comment.id,
                                        subcommentId: subcommentId,
                                      }); // Chỉ chỉnh sửa subcomment này
                                      setEditText(sub.subcontent); // Lấy nội dung cũ để sửa
                                    }}
                                    className="btn-actions btn-edit"
                                  >
                                    <LazyImage
                                      src={edit_icon}
                                      alt="Edit Comment"
                                      width="18px"
                                      height="18px"
                                      className="edit-icon"
                                    />
                                  </button>
                                )
                              )}
                            </div>
                          )
                        )}
                      {/* Input để thêm subcomment */}
                      <div className="subComment-input">
                        <input
                          type="text"
                          value={newSubcomment}
                          onChange={(e) => setNewSubcomment(e.target.value)}
                          placeholder="Phản hồi..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddSubcomment(comment.id, newSubcomment);
                              setNewSubcomment(""); // Reset input
                            }
                          }}
                        />
                        <button
                          className="subComment-btn"
                          onClick={() => {
                            handleAddSubcomment(comment.id, newSubcomment);
                            setNewSubcomment(""); // Reset input
                          }}
                        >
                          Gửi
                        </button>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
