import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { databaseResponseTimeHistogram } from '../modules/metrics';

export const getAllOrganizations = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getAllOrganizations' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const organizations = await prisma.organization.findMany({
      include: {
        hacksTargetedBy: true,
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: organizations });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred while deleting a hack.',
    });
  }
};

export const getOrganizationById = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getOrganizationById' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: parseInt(req.params?.id),
      },
      include: {
        hacksTargetedBy: true,
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    return res.json({ data: organization });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred while deleting a hack.',
    });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'createOrganization' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const organization = await prisma.organization.create({
      data: req.body,
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: organization });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred while creating an organization.',
    });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'updateOrganization' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const organization = await prisma.organization.update({
      where: {
        id: parseInt(req.params?.id),
      },
      data: req.body,
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: organization });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        message: 'Organization not found.',
      });
    }
    res.status(500).json({
      error: 'An unexpected error has occurred while updating an organization.',
    });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'deleteOrganization' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    await prisma.organization.delete({
      where: {
        id: parseInt(req.params?.id),
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ message: 'Organization deleted.' });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        message: 'Organization not found.',
      });
    }
    res.status(500).json({
      error: 'An unexpected error has occurred while deleting an organization.',
    });
  }
};
