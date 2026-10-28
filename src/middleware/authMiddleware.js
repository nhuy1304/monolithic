import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra có Authorization header hay không
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Không có token xác thực",
    });
  }

  // Lấy token sau chữ Bearer
  const token = authHeader.split(" ")[1];

  try {
    // Kiểm tra token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Lưu thông tin từ token vào request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

export default authMiddleware;