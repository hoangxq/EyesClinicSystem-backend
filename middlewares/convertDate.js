const convertDOBFormat = (dob) => {
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0'); // Chuẩn hóa định dạng ngày
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Chuẩn hóa định dạng tháng
    const year = date.getFullYear(); // Lấy toàn bộ năm
  
    // Chuẩn hóa các phần tử để có dạng dd-mm-yyyy
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  };
module.exports = {
    convertDOBFormat
}