import { CustomError } from '../utils/customError.js'; // Assuming you have a custom error class

// Helper to dynamically get model and check permissions
const getModelAndCheckPermissions = async (Model, req, next, ownerField = null) => {
  if (!Model) {
    throw new CustomError('Model not provided to generic controller.', 500);
  }

  // For sensitive operations, ensure user is authenticated
  if (req.method !== 'GET' || (req.method === 'GET' && req.params.id)) { // CRUD operations and get by ID are often protected
    if (!req.user) {
      throw new CustomError('Authentication required.', 401);
    }
  }

  if (ownerField && req.params.id) {
    const instance = await Model.findByPk(req.params.id);
    if (instance && req.user.role !== 'admin' && instance[ownerField] !== req.user.id) {
      throw new CustomError('Forbidden: You are not authorized to perform this action on this resource.', 403);
    }
  }

  return Model;
};

export const createOne = (Model) => async (req, res, next) => {
  try {
    const CurrentModel = await getModelAndCheckPermissions(Model, req, next);
    const newInstance = await CurrentModel.create(req.body);
    res.status(201).json({ message: `${CurrentModel.name} created successfully.`, data: newInstance });
  } catch (error) {
    next(error);
  }
};

export const getAll = (Model) => async (req, res, next) => {
  try {
    const CurrentModel = await getModelAndCheckPermissions(Model, req, next);
    const instances = await CurrentModel.findAll();
    res.status(200).json(instances);
  } catch (error) {
    next(error);
  }
};

export const getOne = (Model) => async (req, res, next) => {
  try {
    const CurrentModel = await getModelAndCheckPermissions(Model, req, next);
    const instance = await CurrentModel.findByPk(req.params.id);
    if (!instance) {
      throw new CustomError(`${CurrentModel.name} not found.`, 404);
    }
    res.status(200).json(instance);
  } catch (error) {
    next(error);
  }
};

export const updateOne = (Model) => async (req, res, next) => {
  try {
    const CurrentModel = await getModelAndCheckPermissions(Model, req, next);
    const { id } = req.params;
    const [updatedRows] = await CurrentModel.update(req.body, {
      where: { id },
      returning: true,
    });

    if (updatedRows === 0) {
      throw new CustomError(`${CurrentModel.name} not found or no changes made.`, 404);
    }
    const updatedInstance = await CurrentModel.findByPk(id); // Fetch the updated instance
    res.status(200).json({ message: `${CurrentModel.name} updated successfully.`, data: updatedInstance });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = (Model) => async (req, res, next) => {
  try {
    const CurrentModel = await getModelAndCheckPermissions(Model, req, next);
    const { id } = req.params;
    const deleted = await CurrentModel.destroy({
      where: { id },
    });

    if (deleted === 0) {
      throw new CustomError(`${CurrentModel.name} not found.`, 404);
    }

    res.status(200).json({ message: `${CurrentModel.name} deleted successfully.` });
  } catch (error) {
    next(error);
  }
};
