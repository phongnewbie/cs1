let dataName = "listS35B5"; // Đảm bảo khai báo trước khi sử dụng.
let currentPage = 1;
let itemsPerPage = 5;
// Mã của bạn ở đây
toastr.options = {
  progressBar: true,
  positionClass: "toast-top-right", // Chỉnh vị trí hiển thị thông báo
  timeOut: "3000", // Thời gian tồn tại của thông báo (3 giây)
};
render();

function getData() {
  return JSON.parse(localStorage.getItem(dataName)) || [];
}
function showAddGui(isUpdate = null) {
  const gui = document.getElementById("addGui");

  // Nếu không truyền tham số (isUpdate === null), thì chỉ đóng/mở form
  if (isUpdate === null) {
    gui.classList.toggle("hide");
    return;
  }

  const title = document.querySelector("#addGuiHeader span");
  const addButton = document.getElementById("addButton");

  if (isUpdate) {
    title.textContent = "Cập nhật danh mục";
    addButton.textContent = "Cập nhật";
    addButton.onclick = saveEditItem; // Gán hàm cập nhật
  } else {
    title.textContent = "Thêm danh mục";
    addButton.textContent = "Thêm";
    addButton.onclick = addItem; // Gán hàm thêm mới

    // Reset form khi thêm mới
    document.getElementById("inputID").value = "";
    document.getElementById("inputName").value = "";
    document.querySelector(
      'input[name="status"][value="Dang hoat dong"]'
    ).checked = true;

    window.currentEditId = null; // Reset trạng thái chỉnh sửa
  }

  gui.classList.remove("hide"); // Hiển thị form
}

document.getElementById("Status").addEventListener("change", function () {
  currentPage = 1;
  render();
});

function render() {
  let selectedStatus = document.getElementById("Status").value;
  let list = getData();
  let filteredList = list.filter(
    (item) => selectedStatus === "Tat ca" || item.status === selectedStatus
  );
  let totalPages = Math.ceil(filteredList.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages) || 1;

  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  let paginatedList = filteredList.slice(start, end);

  let message = `
          <tr>
              <td class="td1 tdHeader">Mã danh mục <i class="fa-solid fa-arrow-down"></i></td>
              <td class="td2 tdHeader">Tên danh mục <i class="fa-solid fa-arrow-down"></i></td>
              <td class="td3 tdHeader">Trạng thái</td>
              <td class="td4 tdHeader">chức năng</td>
          </tr>
      `;

  paginatedList.forEach((item) => {
    let statusMess =
      item.status === "Dang hoat dong"
        ? `<td class="td3"><mark class="statusOn">&bull; ${item.status}</mark></td>`
        : `<td class="td3"><mark class="statusOff">&bull; ${item.status}</mark></td>`;

    message += `
              <tr>
                  <td class="td1">${item.id}</td>
                  <td class="td2">${item.name}</td>
                  ${statusMess}
                  <td class="td4">
                      <button onclick="deleteItem('${item.id}')" class="trashButton"><i class="fa-solid fa-trash"></i></button>
  
                    <button onclick="editItem('${item.id}')" class="penButton"><i class="fa-solid fa-pen"></i></button>
  
                  </td>
              </tr>
          `;
  });

  document.getElementById("fontTable").innerHTML = message;
  renderPagination(totalPages);

  // Debugging: Kiểm tra việc render lại
  console.log("Đã render lại danh sách");
}

function deleteItem(id) {
  Swal.fire({
    title: "Bạn có chắc chắn muốn xoá?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      let list = getData();

      if (!list || list.length === 0) {
        toastr.error("Không có dữ liệu để xoá!", "Lỗi");
        return;
      }

      // ❗❗ Kiểm tra nếu chỉ còn 1 mục thì không cho xoá
      if (list.length <= 1) {
        toastr.warning(
          "Phải có ít nhất 1 danh mục, không thể xoá!",
          "Cảnh báo"
        );
        return;
      }

      // Sao lưu dữ liệu cũ phòng mất
      localStorage.setItem("backup_" + dataName, JSON.stringify(list));

      let newList = list.filter((item) => item.id !== id);

      if (newList.length === list.length) {
        toastr.warning("Không tìm thấy danh mục để xoá!", "Cảnh báo");
        return;
      }

      localStorage.setItem(dataName, JSON.stringify(newList));
      render();

      toastr.success("Đã xoá danh mục thành công!", "Thành công");
      console.log("Danh mục đã được xoá:", id);
    }
  });
}

function renderPagination(totalPages) {
  let paginationHTML = `<button onclick="changePage(-1)" ${
    currentPage === 1 ? "disabled" : ""
  }>←</button>`;
  if (totalPages > 7) {
    if (currentPage > 3)
      paginationHTML += `<button onclick="goToPage(1)">1</button>`;
    if (currentPage > 4) paginationHTML += `<span>...</span>`;

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `<button onclick="goToPage(${i})" class="${
        i === currentPage ? "active" : ""
      }">${i}</button>`;
    }

    if (currentPage < totalPages - 3) paginationHTML += `<span>...</span>`;
    if (currentPage < totalPages - 2)
      paginationHTML += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
  } else {
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button onclick="goToPage(${i})" class="${
        i === currentPage ? "active" : ""
      }">${i}</button>`;
    }
  }
  paginationHTML += `<button onclick="changePage(1)" ${
    currentPage >= totalPages ? "disabled" : ""
  }>→</button>`;
  document.getElementById("pagination").innerHTML = paginationHTML;
}
function editItem(id) {
  let list = getData();
  let item = list.find((item) => item.id === id);

  if (item) {
    // Điền dữ liệu vào form chỉnh sửa
    document.getElementById("inputID").value = item.id;
    document.getElementById("inputName").value = item.name;
    document.querySelector(
      `input[name="status"][value="${item.status}"]`
    ).checked = true;

    // Lưu ID của mục đang sửa
    window.currentEditId = id;

    // Gọi hàm showAddGui với chế độ cập nhật
    showAddGui(true);
  }
}

function saveEditItem() {
  let idInput = document.getElementById("inputID").value.trim();
  let nameInput = document.getElementById("inputName").value.trim();

  if (!idInput || !nameInput) {
    if (!idInput)
      document.getElementById("errorIDAlert").classList.remove("hide");
    if (!nameInput)
      document.getElementById("errorNameAlert").classList.remove("hide");
    return;
  }

  let list = getData();
  let itemIndex = list.findIndex((item) => item.id === window.currentEditId);

  if (itemIndex !== -1) {
    // Kiểm tra nếu ID bị thay đổi, tránh trùng lặp với danh mục khác
    if (
      idInput !== window.currentEditId &&
      list.some((item) => item.id === idInput)
    ) {
      document.getElementById("errorIDAlert").classList.remove("hide");
      document.getElementById("errorIDAlert").innerHTML =
        "ID bị trùng lặp, vui lòng nhập lại!";
      return;
    }

    // Cập nhật dữ liệu
    list[itemIndex].id = idInput;
    list[itemIndex].name = nameInput;
    list[itemIndex].status = document.querySelector(
      'input[name="status"]:checked'
    ).value;

    // Cập nhật lại localStorage
    localStorage.setItem(dataName, JSON.stringify(list));

    render(); // Cập nhật lại danh sách
    showAddGui(); // Đóng form sửa
    window.currentEditId = null; // Reset lại ID sau khi cập nhật
  } else {
    console.log("Không tìm thấy mục để cập nhật!");
  }
}

function changePage(step) {
  currentPage += step;
  render();
}

function goToPage(page) {
  currentPage = page;
  render();
}

function addItem() {
  let idInput = document.getElementById("inputID").value.trim();
  let nameInput = document.getElementById("inputName").value.trim();

  if (window.currentEditId) {
    // Nếu đang ở chế độ chỉnh sửa, gọi saveEditItem()
    saveEditItem();
    window.currentEditId = null; // Reset currentEditId sau khi cập nhật
  } else {
    // Nếu không có currentEditId, là chế độ thêm mới
    if (idInput && nameInput) {
      let list = getData();
      document.getElementById("errorIDAlert").classList.add("hide");
      document.getElementById("errorNameAlert").classList.add("hide");

      // Kiểm tra trùng ID
      if (list.some((item) => item.id === idInput)) {
        document.getElementById("errorIDAlert").classList.remove("hide");
        document.getElementById("errorIDAlert").innerHTML =
          "ID bị trùng lặp, vui lòng nhập lại!";
        return;
      }

      // Thêm mục mới vào danh sách
      let status = document.querySelector('input[name="status"]:checked').value;
      let temp = { id: idInput, name: nameInput, status };
      list.push(temp);

      // Cập nhật lại localStorage
      localStorage.setItem(dataName, JSON.stringify(list));

      document.getElementById("inputID").value = "";
      document.getElementById("inputName").value = "";
      document.querySelector('input[name="status"]:checked').checked = true;

      render(); // Cập nhật lại danh sách
      showAddGui(); // Đóng form thêm
    } else {
      document
        .getElementById("errorIDAlert")
        .classList.toggle("hide", !!idInput);
      document
        .getElementById("errorNameAlert")
        .classList.toggle("hide", !!nameInput);
    }
  }
}
function logout() {
  // Xử lý đăng xuất ở đây (xóa token, localStorage, redirect...)
  alert("Bạn đã đăng xuất");
  window.location.href = "/pages/login.html"; // Chuyển hướng đến trang login
}

function goHome() {
  window.location.href = "/index.html"; // hoặc trang nào bạn muốn
}
