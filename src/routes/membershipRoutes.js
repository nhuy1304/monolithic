import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// Lấy danh sách tất cả Membership
router.get("/", async (req, res) => {
  try {
    const memberships = await db.orm.public.Membership.all();

    res.status(200).json(memberships);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách Membership",
    });
  }
});

// Lấy Membership theo mid
router.get("/:id", async (req, res) => {
  try {
    const mid = Number(req.params.id);

    if (!Number.isInteger(mid)) {
      return res.status(400).json({
        message: "mid không hợp lệ",
      });
    }

    const membership = await db.orm.public.Membership.first({ mid });

    if (!membership) {
      return res.status(404).json({
        message: "Không tìm thấy Membership",
      });
    }

    res.status(200).json(membership);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy Membership",
    });
  }
});

// Tạo Membership mới
router.post("/", async (req, res) => {
  try {
    const { mname, score } = req.body;

    if (!mname) {
      return res.status(400).json({
        message: "mname là bắt buộc",
      });
    }

    if (!Number.isInteger(score)) {
      return res.status(400).json({
        message: "score phải là số nguyên",
      });
    }

    const membership = await db.orm.public.Membership.create({
      mname,
      score,
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể tạo Membership",
    });
  }
});

// Cập nhật Membership
router.put("/:id", async (req, res) => {
  try {
    const mid = Number(req.params.id);
    const { mname, score } = req.body;

    if (!Number.isInteger(mid)) {
      return res.status(400).json({
        message: "mid không hợp lệ",
      });
    }

    if (!mname) {
      return res.status(400).json({
        message: "mname là bắt buộc",
      });
    }

    if (!Number.isInteger(score)) {
      return res.status(400).json({
        message: "score phải là số nguyên",
      });
    }

    const membership = await db.orm.public.Membership
      .where({ mid })
      .update({
        mname,
        score,
      });

    if (!membership) {
      return res.status(404).json({
        message: "Không tìm thấy Membership",
      });
    }

    res.status(200).json(membership);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể cập nhật Membership",
    });
  }
});

// Xóa Membership
router.delete("/:id", async (req, res) => {
  try {
    const mid = Number(req.params.id);

    if (!Number.isInteger(mid)) {
      return res.status(400).json({
        message: "mid không hợp lệ",
      });
    }

    const membership = await db.orm.public.Membership
      .where({ mid })
      .delete();

    if (!membership) {
      return res.status(404).json({
        message: "Không tìm thấy Membership",
      });
    }

    res.status(200).json({
      message: "Xóa Membership thành công",
      membership,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể xóa Membership",
    });
  }
});

export default router;