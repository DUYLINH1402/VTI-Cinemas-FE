// const handleGoogleLogin = () => {
//   dispatch(googleLogin())
//     .unwrap()
//     .then((userCredential) => {
//       const user = userCredential.user; // Lấy user từ userCredential
//       if (user) {
//         user.getIdToken().then((token) => {
//           localStorage.setItem("authToken", token);
//           closeModal();
//           navigate("/");
//         });
//       }
//     })
//     .catch((error) => {
//       console.error("Google login failed:", error.message);
//     });
// };
// const handleFacebookLogin = () => {
//   dispatch(facebookLogin())
//     .unwrap()
//     .then((userCredential) => {
//       const user = userCredential.user; // Lấy user từ userCredential
//       if (user) {
//         user.getIdToken().then((token) => {
//           localStorage.setItem("authToken", token);
//           closeModal();
//           navigate("/");
//         });
//       }
//     })
//     .catch((error) => {
//       console.error("Facebook login failed:", error.message);
//     });
// };
