import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// Lấy danh sách tất cả Order
router.get("/", async (req, res) => {
  try {
    const orders = await db.orm.public.Order.all();

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách Order",
    });
  }
});

// Lấy Order theo oid
router.get("/:id", async (req, res) => {
  try {
    const oid = Number(req.params.id);

    if (!Number.isInteger(oid)) {
      return res.status(400).json({
        message: "oid không hợp lệ",
      });
    }

    const order = await db.orm.public.Order.first({ oid });

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy Order",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy Order",
    });
  }
});

// Tạo Order mới
router.post("/", async (req, res) => {
  try {
    const { uid, createat } = req.body;

    if (!Number.isInteger(uid)) {
      return res.status(400).json({
        message: "uid phải là số nguyên",
      });
    }

    if (!createat) {
      return res.status(400).json({
        message: "createat là bắt buộc",
      });
    }

    let createTime;

    try {
      createTime = Temporal.Instant.from(createat);
    } catch (error) {
      return res.status(400).json({
        message: "createat không hợp lệ",
      });
    }

    const order = await db.orm.public.Order.create({
      uid,
      createat: createTime,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể tạo Order",
    });
  }
});

// Cập nhật Order
router.put("/:id", async (req, res) => {
  try {
    const oid = Number(req.params.id);
    const { uid, createat } = req.body;

    if (!Number.isInteger(oid)) {
      return res.status(400).json({
        message: "oid không hợp lệ",
      });
    }

    if (!Number.isInteger(uid)) {
      return res.status(400).json({
        message: "uid phải là số nguyên",
      });
    }

    if (!createat) {
      return res.status(400).json({
        message: "createat là bắt buộc",
      });
    }

    let createTime;

    try {
      createTime = Temporal.Instant.from(createat);
    } catch (error) {
      return res.status(400).json({
        message: "createat không hợp lệ",
      });
    }

    const order = await db.orm.public.Order
      .where({ oid })
      .update({
        uid,
        createat: createTime,
      });

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy Order",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể cập nhật Order",
    });
  }
});

// Xóa Order
router.delete("/:id", async (req, res) => {
  try {
    const oid = Number(req.params.id);

    if (!Number.isInteger(oid)) {
      return res.status(400).json({
        message: "oid không hợp lệ",
      });
    }

    const order = await db.orm.public.Order
      .where({ oid })
      .delete();

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy Order",
      });
    }

    res.status(200).json({
      message: "Xóa Order thành công",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể xóa Order",
    });
  }
});

export default router;