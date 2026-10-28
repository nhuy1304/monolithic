import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../prisma/db.js";

const router = express.Router();

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username và password là bắt buộc",
      });
    }

    // Tìm User theo username
    const user = await db.orm.public.User.first({ username });

    if (!user) {
      return res.status(401).json({
        message: "Username hoặc password không đúng",
      });
    }

    // So sánh password với password đã mã hóa trong database
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Username hoặc password không đúng",
      });
    }

    // Tạo JWT
    const token = jwt.sign(
      {
        uid: user.uid,
        username: user.username,
        roleid: user.roleid,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        uid: user.uid,
        username: user.username,
        fullname: user.fullname,
        roleid: user.roleid,
        mid: user.mid,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể đăng nhập",
    });
  }
});


// Đăng ký tài khoản
router.post("/register", async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username và password là bắt buộc",
      });
    }

    const existingUser = await db.orm.public.User.first({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "Username đã tồn tại",
      });
    }

    // Tài khoản đăng ký mặc định là người dùng bình thường
    const normalRole = await db.orm.public.Role.first({
      rolename: "Normal",
    });

    const basicMembership = await db.orm.public.Membership.first({
      mname: "Basic",
    });

    if (!normalRole || !basicMembership) {
      return res.status(500).json({
        message: "Chưa có Role Normal hoặc Membership Basic",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.orm.public.User.create({
      username,
      fullname: fullname || username,
      password: hashedPassword,
      roleid: normalRole.roleid,
      mid: basicMembership.mid,
    });

    const { password: hiddenPassword, ...safeUser } = user;

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Không thể đăng ký",
    });
  }
});


export default router;