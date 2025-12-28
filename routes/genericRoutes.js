import { Router } from 'express';
import { isAuthenticated, hasRole } from '../middleware/auth.js';
import * as genericController from '../controllers/genericController.js';
import db from '../config/db.js';

/**
 * Factory function to create generic CRUD routes for a given model.
 * @param {string} modelName - The name of the model (e.g., 'Category', 'Registration').
 * @param {Array<string>} createRoles - Roles allowed to create (e.g., ['admin', 'organizer']).
 * @param {Array<string>} updateRoles - Roles allowed to update.
 * @param {Array<string>} deleteRoles - Roles allowed to delete.
 * @param {boolean} publicRead - Whether getAll and getOne routes are public (true) or protected (false).
 * @param {string} ownerField - The field name in the model that represents the owner (e.g., 'userId', 'organizerId'). Used for fine-grained authorization if applicable. If not provided, only hasRole will be used for update/delete.
 */
export const createGenericRoutes = (modelName, { createRoles, updateRoles, deleteRoles, publicRead = true, ownerField = null } = {}) => {
  const router = Router();
  const Model = db[modelName];

  if (!Model) {
    throw new Error(`Model ${modelName} not found in DB object.`);
  }

  // GET All
  if (publicRead) {
    router.get('/', genericController.getAll(Model));
  } else {
    router.get('/', isAuthenticated, hasRole(updateRoles || ['admin']), genericController.getAll(Model));
  }

  // GET by ID
  if (publicRead) {
    router.get('/:id', genericController.getOne(Model));
  } else {
    router.get('/:id', isAuthenticated, hasRole(updateRoles || ['admin']), genericController.getOne(Model));
  }

  // POST (Create One)
  if (createRoles) {
    router.post('/', isAuthenticated, hasRole(createRoles), genericController.createOne(Model));
  }

  // PUT (Update One)
  if (updateRoles) {
    router.put('/:id', isAuthenticated, hasRole(updateRoles), genericController.updateOne(Model));
  }

  // DELETE (Delete One)
  if (deleteRoles) {
    router.delete('/:id', isAuthenticated, hasRole(deleteRoles), genericController.deleteOne(Model));
  }

  return router;
};
