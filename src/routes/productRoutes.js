import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// Lấy danh sách tất cả Product
router.get("/", async (req, res) => {
  try {
    const products = await db.orm.public.Product.all();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách Product",
    });
  }
});

// Lấy Product theo pid
router.get("/:id", async (req, res) => {
  try {
    const pid = Number(req.params.id);

    if (!Number.isInteger(pid)) {
      return res.status(400).json({
        message: "pid không hợp lệ",
      });
    }

    const product = await db.orm.public.Product.first({ pid });

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy Product",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy Product",
    });
  }
});

// Tạo Product mới
router.post("/", async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;

    if (!pname) {
      return res.status(400).json({
        message: "pname là bắt buộc",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        message: "price phải là số không âm",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        message: "quantity phải là số nguyên không âm",
      });
    }

    const product = await db.orm.public.Product.create({
      pname,
      price,
      quantity,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể tạo Product",
    });
  }
});

// Cập nhật Product
router.put("/:id", async (req, res) => {
  try {
    const pid = Number(req.params.id);
    const { pname, price, quantity } = req.body;

    if (!Number.isInteger(pid)) {
      return res.status(400).json({
        message: "pid không hợp lệ",
      });
    }

    if (!pname) {
      return res.status(400).json({
        message: "pname là bắt buộc",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        message: "price phải là số không âm",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        message: "quantity phải là số nguyên không âm",
      });
    }

    const product = await db.orm.public.Product
      .where({ pid })
      .update({
        pname,
        price,
        quantity,
      });

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy Product",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể cập nhật Product",
    });
  }
});

// Xóa Product
router.delete("/:id", async (req, res) => {
  try {
    const pid = Number(req.params.id);

    if (!Number.isInteger(pid)) {
      return res.status(400).json({
        message: "pid không hợp lệ",
      });
    }

    const product = await db.orm.public.Product
      .where({ pid })
      .delete();

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy Product",
      });
    }

    res.status(200).json({
      message: "Xóa Product thành công",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể xóa Product",
    });
  }
});

export default router;