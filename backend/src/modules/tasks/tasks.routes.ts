import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { create, getById, list, remove, toggle, update } from "./tasks.controller";

const router = Router();

router.get("/", requireAuth, list);
router.post("/", requireAuth, create);
router.get("/:id", requireAuth, getById);
router.patch("/:id", requireAuth, update);
router.delete("/:id", requireAuth, remove);
router.post("/:id/toggle", requireAuth, toggle);

export default router;
