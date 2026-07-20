import { Prisma } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { prisma } from "../lib/prisma";

export const candidatesRouter = Router();

candidatesRouter.get(
  "/candidates",
  asyncHandler(async (_req, res) => {
    const candidates = await prisma.candidate.findMany({ orderBy: { createdAt: "desc" } });
    res.json(candidates);
  })
);

candidatesRouter.get(
  "/candidates/:id",
  asyncHandler(async (req, res) => {
    const candidate = await prisma.candidate.findUnique({ where: { id: req.params.id } });
    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }
    res.json(candidate);
  })
);

candidatesRouter.post(
  "/candidates",
  asyncHandler(async (req, res) => {
    const { name, email, stage } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim()) {
      res.status(400).json({ error: "name and email are required" });
      return;
    }

    try {
      const candidate = await prisma.candidate.create({
        data: { name, email, ...(stage !== undefined ? { stage } : {}) },
      });
      res.status(201).json(candidate);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        res.status(409).json({ error: "email already exists" });
        return;
      }
      throw err;
    }
  })
);

candidatesRouter.patch(
  "/candidates/:id",
  asyncHandler(async (req, res) => {
    const { name, email, stage } = req.body ?? {};
    const data: Prisma.CandidateUpdateInput = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (stage !== undefined) data.stage = stage;

    try {
      const candidate = await prisma.candidate.update({ where: { id: req.params.id }, data });
      res.json(candidate);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          res.status(404).json({ error: "Candidate not found" });
          return;
        }
        if (err.code === "P2002") {
          res.status(409).json({ error: "email already exists" });
          return;
        }
      }
      throw err;
    }
  })
);

candidatesRouter.delete(
  "/candidates/:id",
  asyncHandler(async (req, res) => {
    try {
      await prisma.candidate.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        res.status(404).json({ error: "Candidate not found" });
        return;
      }
      throw err;
    }
  })
);
