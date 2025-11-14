import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import validate, { validateType } from '../middleware/validate.middleware';
import { createPropertySchema } from '../utils/validators/create-property';
import { filterPropertySchema } from '../utils/validators/filter.property';
import { MongoIDSchema } from '../share/validate-mongo-id';
const router = Router();


router.post('/',validate(validateType.BODY, createPropertySchema),PropertyController.createProperty); 
router.get('/',validate(validateType.QUERY, filterPropertySchema), PropertyController.getAllProperties);
router.put('/:id', validate(validateType.PARAMS, MongoIDSchema), validate(validateType.BODY, createPropertySchema), PropertyController.updateProperty);
router.delete('/:id',validate(validateType.PARAMS, MongoIDSchema), PropertyController.deleteProperty);

export default router;