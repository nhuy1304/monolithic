import express from "express";
import { db } from "../prisma/db.js";

const router = express.Router();

// Lấy danh sách tất cả Role
router.get("/", async (req, res) => {
  try {
    const roles = await db.orm.public.Role.all();

    res.status(200).json(roles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy danh sách Role",
    });
  }
});

// Lấy Role theo roleid
router.get("/:id", async (req, res) => {
  try {
    const roleid = Number(req.params.id);

    if (!Number.isInteger(roleid)) {
      return res.status(400).json({
        message: "roleid không hợp lệ",
      });
    }

    const role = await db.orm.public.Role.first({ roleid });

    if (!role) {
      return res.status(404).json({
        message: "Không tìm thấy Role",
      });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể lấy Role",
    });
  }
});

// Tạo Role mới
router.post("/", async (req, res) => {
  try {
    const { rolename } = req.body;

    if (!rolename) {
      return res.status(400).json({
        message: "rolename là bắt buộc",
      });
    }

    const role = await db.orm.public.Role.create({
      rolename,
    });

    res.status(201).json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể tạo Role",
    });
  }
});

// Cập nhật Role
router.put("/:id", async (req, res) => {
  try {
    const roleid = Number(req.params.id);
    const { rolename } = req.body;

    if (!Number.isInteger(roleid)) {
      return res.status(400).json({
        message: "roleid không hợp lệ",
      });
    }

    if (!rolename) {
      return res.status(400).json({
        message: "rolename là bắt buộc",
      });
    }

    const role = await db.orm.public.Role
      .where({ roleid })
      .update({ rolename });

    if (!role) {
      return res.status(404).json({
        message: "Không tìm thấy Role",
      });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể cập nhật Role",
    });
  }
});

// Xóa Role
router.delete("/:id", async (req, res) => {
  try {
    const roleid = Number(req.params.id);

    if (!Number.isInteger(roleid)) {
      return res.status(400).json({
        message: "roleid không hợp lệ",
      });
    }

    const role = await db.orm.public.Role
      .where({ roleid })
      .delete();

    if (!role) {
      return res.status(404).json({
        message: "Không tìm thấy Role",
      });
    }

    res.status(200).json({
      message: "Xóa Role thành công",
      role,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Không thể xóa Role",
    });
  }
});

export default router;