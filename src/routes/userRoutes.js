import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../prisma/db.js";

const router = express.Router();

// Lấy danh sách tất cả User
router.get("/", async (req, res) => {
  try {
    const users = await db.orm.public.User.all();

    // Không trả password ra ngoài API
    const safeUsers = users.map(({ password, ...user }) => user);

    res.status(200).json(safeUsers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách User",
    });
  }
});

// Lấy User theo uid
router.get("/:id", async (req, res) => {
  try {
    const uid = Number(req.params.id);

    if (!Number.isInteger(uid)) {
      return res.status(400).json({
        message: "uid không hợp lệ",
      });
    }

    const user = await db.orm.public.User.first({ uid });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy User",
      });
    }

    // Không trả password ra ngoài API
    const { password, ...safeUser } = user;

    res.status(200).json(safeUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy User",
    });
  }
});

// Tạo User mới
router.post("/", async (req, res) => {
  try {
    const {
      username,
      fullname,
      password,
      roleid,
      mid,
    } = req.body;

    if (!username || !fullname || !password) {
      return res.status(400).json({
        message: "username, fullname và password là bắt buộc",
      });
    }

    if (!Number.isInteger(roleid)) {
      return res.status(400).json({
        message: "roleid phải là số nguyên",
      });
    }

    if (!Number.isInteger(mid)) {
      return res.status(400).json({
        message: "mid phải là số nguyên",
      });
    }

    // Mã hóa password trước khi lưu database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.orm.public.User.create({
      username,
      fullname,
      password: hashedPassword,
      roleid,
      mid,
    });

    // Không trả password ra ngoài API
    const { password: hiddenPassword, ...safeUser } = user;

    res.status(201).json(safeUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể tạo User",
    });
  }
});

// Cập nhật User
router.put("/:id", async (req, res) => {
  try {
    const uid = Number(req.params.id);

    const {
      username,
      fullname,
      password,
      roleid,
      mid,
    } = req.body;

    if (!Number.isInteger(uid)) {
      return res.status(400).json({
        message: "uid không hợp lệ",
      });
    }

    if (!username || !fullname || !password) {
      return res.status(400).json({
        message: "username, fullname và password là bắt buộc",
      });
    }

    if (!Number.isInteger(roleid)) {
      return res.status(400).json({
        message: "roleid phải là số nguyên",
      });
    }

    if (!Number.isInteger(mid)) {
      return res.status(400).json({
        message: "mid phải là số nguyên",
      });
    }

    // Mã hóa password mới trước khi cập nhật
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.orm.public.User
      .where({ uid })
      .update({
        username,
        fullname,
        password: hashedPassword,
        roleid,
        mid,
      });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy User",
      });
    }

    // Không trả password ra ngoài API
    const { password: hiddenPassword, ...safeUser } = user;

    res.status(200).json(safeUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể cập nhật User",
    });
  }
});

// Xóa User
router.delete("/:id", async (req, res) => {
  try {
    const uid = Number(req.params.id);

    if (!Number.isInteger(uid)) {
      return res.status(400).json({
        message: "uid không hợp lệ",
      });
    }

    const user = await db.orm.public.User
      .where({ uid })
      .delete();

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy User",
      });
    }

    // Không trả password ra ngoài API
    const { password, ...safeUser } = user;

    res.status(200).json({
      message: "Xóa User thành công",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể xóa User",
    });
  }
});

export default router;