import { Router } from 'express';
import { searchShelters } from '../apis/searchShelters';

export const sheltersRouter = Router();

sheltersRouter.get('/', searchShelters);