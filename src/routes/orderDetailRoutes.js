import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// Lấy danh sách tất cả OrderDetail
router.get("/", async (req, res) => {
  try {
    const orderDetails = await db.orm.public.OrderDetail.all();

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách OrderDetail",
    });
  }
});

// Lấy OrderDetail theo khóa chính kép oid + pid
router.get("/:oid/:pid", async (req, res) => {
  try {
    const oid = Number(req.params.oid);
    const pid = Number(req.params.pid);

    if (!Number.isInteger(oid) || !Number.isInteger(pid)) {
      return res.status(400).json({
        message: "oid và pid phải là số nguyên",
      });
    }

    const orderDetail = await db.orm.public.OrderDetail.first({
      oid,
      pid,
    });

    if (!orderDetail) {
      return res.status(404).json({
        message: "Không tìm thấy OrderDetail",
      });
    }

    res.status(200).json(orderDetail);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy OrderDetail",
    });
  }
});

// Tạo OrderDetail mới
router.post("/", async (req, res) => {
  try {
    const { oid, pid, qty, unit_price } = req.body;

    if (!Number.isInteger(oid)) {
      return res.status(400).json({
        message: "oid phải là số nguyên",
      });
    }

    if (!Number.isInteger(pid)) {
      return res.status(400).json({
        message: "pid phải là số nguyên",
      });
    }

    if (!Number.isInteger(qty)) {
      return res.status(400).json({
        message: "qty phải là số nguyên",
      });
    }

    if (unit_price === undefined || unit_price === null) {
      return res.status(400).json({
        message: "unit_price là bắt buộc",
      });
    }

    const orderDetail = await db.orm.public.OrderDetail.create({
      oid,
      pid,
      qty,
      unit_price,
    });

    res.status(201).json(orderDetail);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể tạo OrderDetail",
    });
  }
});

// Cập nhật OrderDetail
router.put("/:oid/:pid", async (req, res) => {
  try {
    const oid = Number(req.params.oid);
    const pid = Number(req.params.pid);
    const { qty, unit_price } = req.body;

    if (!Number.isInteger(oid) || !Number.isInteger(pid)) {
      return res.status(400).json({
        message: "oid và pid phải là số nguyên",
      });
    }

    if (!Number.isInteger(qty)) {
      return res.status(400).json({
        message: "qty phải là số nguyên",
      });
    }

    if (unit_price === undefined || unit_price === null) {
      return res.status(400).json({
        message: "unit_price là bắt buộc",
      });
    }

    const orderDetail = await db.orm.public.OrderDetail
      .where({
        oid,
        pid,
      })
      .update({
        qty,
        unit_price,
      });

    if (!orderDetail) {
      return res.status(404).json({
        message: "Không tìm thấy OrderDetail",
      });
    }

    res.status(200).json(orderDetail);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể cập nhật OrderDetail",
    });
  }
});

// Xóa OrderDetail
router.delete("/:oid/:pid", async (req, res) => {
  try {
    const oid = Number(req.params.oid);
    const pid = Number(req.params.pid);

    if (!Number.isInteger(oid) || !Number.isInteger(pid)) {
      return res.status(400).json({
        message: "oid và pid phải là số nguyên",
      });
    }

    const orderDetail = await db.orm.public.OrderDetail
      .where({
        oid,
        pid,
      })
      .delete();

    if (!orderDetail) {
      return res.status(404).json({
        message: "Không tìm thấy OrderDetail",
      });
    }

    res.status(200).json({
      message: "Xóa OrderDetail thành công",
      orderDetail,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể xóa OrderDetail",
    });
  }
});

export default router;