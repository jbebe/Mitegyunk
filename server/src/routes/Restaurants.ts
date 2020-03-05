import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import logger from 'src/utils/Logger';
import { paramMissingError } from 'src/utils/constants';
import {IRestaurantData} from '@shared/Types';
import {DummyDb} from '../DummyDb';

// Init utils
const router = Router();
const restaurantDb = new DummyDb<IRestaurantData>('restaurant');

// GET all
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params as ParamsDictionary;
        const restaurants = await restaurantDb.getAsync((o => o.name === id));
        return res.status(OK).json(restaurants);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// GET all
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await restaurantDb.getAllAsync();
        return res.status(OK).json(users);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// CREATE
router.post('/', async (req: Request, res: Response) => {
    try {
        const { restaurant } = req.body;
        if (!restaurant) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await restaurantDb.addAsync(restaurant);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// UPDATE
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { user: restaurant } = req.body;
        const { id } = req.params as ParamsDictionary;
        if (!restaurant || !id) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await restaurantDb.updateAsync((o) => o.name === id, restaurant);
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// DELETE
router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params as ParamsDictionary;
        await restaurantDb.deleteAsync((o) => o.name === id);
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

export default router;
