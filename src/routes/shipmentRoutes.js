import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// Lấy danh sách tất cả Shipment
router.get("/", async (req, res) => {
  try {
    const shipments = await db.orm.public.Shipment.all();

    res.status(200).json(shipments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách Shipment",
    });
  }
});

// Lấy Shipment theo shipid
router.get("/:id", async (req, res) => {
  try {
    const shipid = Number(req.params.id);

    if (!Number.isInteger(shipid)) {
      return res.status(400).json({
        message: "shipid không hợp lệ",
      });
    }

    const shipment = await db.orm.public.Shipment.first({
      shipid,
    });

    if (!shipment) {
      return res.status(404).json({
        message: "Không tìm thấy Shipment",
      });
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy Shipment",
    });
  }
});

// Tạo Shipment mới
router.post("/", async (req, res) => {
  try {
    const { oid, status } = req.body;

    if (!Number.isInteger(oid)) {
      return res.status(400).json({
        message: "oid phải là số nguyên",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "status là bắt buộc",
      });
    }

    const shipment = await db.orm.public.Shipment.create({
      oid,
      status,
    });

    res.status(201).json(shipment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể tạo Shipment",
    });
  }
});

// Cập nhật Shipment
router.put("/:id", async (req, res) => {
  try {
    const shipid = Number(req.params.id);
    const { oid, status } = req.body;

    if (!Number.isInteger(shipid)) {
      return res.status(400).json({
        message: "shipid không hợp lệ",
      });
    }

    if (!Number.isInteger(oid)) {
      return res.status(400).json({
        message: "oid phải là số nguyên",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "status là bắt buộc",
      });
    }

    const shipment = await db.orm.public.Shipment
      .where({ shipid })
      .update({
        oid,
        status,
      });

    if (!shipment) {
      return res.status(404).json({
        message: "Không tìm thấy Shipment",
      });
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể cập nhật Shipment",
    });
  }
});

// Xóa Shipment
router.delete("/:id", async (req, res) => {
  try {
    const shipid = Number(req.params.id);

    if (!Number.isInteger(shipid)) {
      return res.status(400).json({
        message: "shipid không hợp lệ",
      });
    }

    const shipment = await db.orm.public.Shipment
      .where({ shipid })
      .delete();

    if (!shipment) {
      return res.status(404).json({
        message: "Không tìm thấy Shipment",
      });
    }

    res.status(200).json({
      message: "Xóa Shipment thành công",
      shipment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể xóa Shipment",
    });
  }
});

export default router;
