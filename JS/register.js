function register() {
  // Lấy giá trị từ input
  let fullname = document.getElementById("fullname").value.trim();
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let confirmPassword = document.getElementById("confirmPassword")
    ? document.getElementById("confirmPassword").value.trim()
    : "";
  let terms = document.getElementById("terms").checked;

  // Lấy các phần hiển thị lỗi
  let fullnameError = document.getElementById("fullnameError");
  let nameError = document.getElementById("nameError");
  let emailError = document.getElementById("emailError");
  let passwordError = document.getElementById("passwordError");

  let termsError = document.getElementById("termsError");

  // Reset thông báo lỗi
  fullnameError.innerText = "";
  nameError.innerText = "";
  emailError.innerText = "";
  passwordError.innerText = "";
  confirmPasswordError.innerText = "";
  termsError.innerText = "";

  let isValid = true;

  // Kiểm tra họ và tên không được để trống
  if (fullname === "") {
    fullnameError.innerText = "Họ và tên không được để trống";
    isValid = false;
  }

  if (name === "") {
    nameError.innerText = "Tên không được để trống";
    isValid = false;
  }

  // Kiểm tra email không được để trống và đúng định dạng
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    emailError.innerText = "Email không được để trống";
    isValid = false;
  } else if (!emailPattern.test(email)) {
    emailError.innerText = "Email không hợp lệ";
    isValid = false;
  }

  // Kiểm tra mật khẩu không được để trống và tối thiểu 8 ký tự
  if (password === "") {
    passwordError.innerText = "Mật khẩu không được để trống";
    isValid = false;
  } else if (password.length < 8) {
    passwordError.innerText = "Mật khẩu phải có ít nhất 8 ký tự";
    isValid = false;
  }

  // Kiểm tra mật khẩu xác nhận

  // Kiểm tra điều khoản đã được chọn
  if (!terms) {
    termsError.innerText = "Bạn phải đồng ý với điều khoản";
    isValid = false;
  }

  // Kiểm tra xem email đã tồn tại trong localStorage chưa
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    emailError.innerText = "Email này đã được đăng ký!";
    isValid = false;
  }

  // Nếu tất cả điều kiện hợp lệ
  if (isValid) {
    // Lưu tài khoản vào localStorage
    users.push({ fullname, name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công!");
    setTimeout(() => {
      window.location.href = "login.html"; // Chuyển hướng về trang đăng nhập
    }, 2000);
  }
}
