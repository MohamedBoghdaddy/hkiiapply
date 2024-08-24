import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
} from "../controller/EmployeeController.js";
import { auth, authorizeRoles } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/api/getall", auth, authorizeRoles, getAllEmployees);
router.get("/api/getone/:employeeId", auth, authorizeRoles, getEmployee);
router.put("/api/update/:employeeId", auth, authorizeRoles, updateEmployee);
router.delete("/api/delete/:employeeId", auth, authorizeRoles, deleteEmployee);
router.post("/api/create", auth, authorizeRoles, createEmployee);

export default router;
