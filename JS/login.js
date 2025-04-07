let users = JSON.parse(localStorage.getItem("users")) || [];

// Nếu đã lưu tài khoản, tự động điền email
window.onload = function () {
  let savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    document.getElementById("email").value = savedEmail;
    document.getElementById("rememberMe").checked = true;
  } else {
    document.getElementById("rememberMe").checked = false;
  }

  // Hiển thị thông báo nếu vừa đăng ký thành công
  let registerSuccessMessage = localStorage.getItem("registerSuccess");
  if (registerSuccessMessage) {
    alert(registerSuccessMessage);
    localStorage.removeItem("registerSuccess"); // Xóa thông báo sau khi hiển thị
  }
};

function login() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let rememberMe = document.getElementById("rememberMe").checked;

  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  // Kiểm tra email không được để trống
  if (email === "") {
    document.getElementById("emailError").textContent = "Vui lòng nhập email!";
    return;
  }

  // Kiểm tra mật khẩu không được để trống
  if (password === "") {
    document.getElementById("passwordError").textContent =
      "Vui lòng nhập mật khẩu!";
    return;
  }

  // Kiểm tra xem email có tồn tại không
  let foundUser = users.find((user) => user.email === email);

  if (!foundUser) {
    document.getElementById("emailError").textContent = "Email không tồn tại!";
    return;
  }

  // Kiểm tra mật khẩu có đúng không
  if (foundUser.password !== password) {
    document.getElementById("passwordError").textContent =
      "Mật khẩu không đúng!";
    return;
  }

  // Ghi nhớ tài khoản nếu được chọn
  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  // Thông báo đăng nhập thành công bằng alert
  alert("Đăng nhập thành công!");

  // Chuyển hướng về trang Dashboard (Sửa lỗi từ `indow` thành `window`)
  window.location.href = "./category-manager.html";
}
