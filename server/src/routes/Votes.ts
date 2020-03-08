import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import logger from 'src/utils/Logger';
import { paramMissingError } from 'src/utils/constants';
import {IPreference, IVote} from '@shared/Types';
import {DummyDb} from '../DummyDb';

// Init utils
const router = Router();
const voteDb = new DummyDb<IVote>('vote');

// Create new vote for restaurant
// Delete vote for restaurant

// GET
router.get('/:user', async (req: Request, res: Response) => {
    try {
        const { userName } = req.params as ParamsDictionary;
        const userVotes = await voteDb.getAsync((v => v.name === userName));
        return res.status(OK).json(userVotes);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// Get all votes
router.get('/', async (req: Request, res: Response) => {
    try {
        const votes = await voteDb.getAllAsync();
        return res.status(OK).json(votes);
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
        const voter = req.body as IVote;
        if (!voter) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await voteDb.addAsync(voter);
        return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// UPDATE
router.put('/:user', async (req: Request, res: Response) => {
    try {
        const preference = req.body as IPreference;
        const { userName } = req.params as ParamsDictionary;
        if (!preference || !userName) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await voteDb.updateAsync(
            (v) => v.name === userName,
            (prev) => ({
                name: prev.name,
                restaurants: (() => {
                    const oldIdx = prev.restaurants.findIndex(r => r.name === preference.name);
                    prev.restaurants.splice(oldIdx, 1, preference);
                    return prev.restaurants;
                })(),
        }));
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// DELETE
router.delete('/:user/:restaurant', async (req: Request, res: Response) => {
    try {
        const { user, restaurant } = req.params as ParamsDictionary;
        if (!user || !restaurant) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await voteDb.deleteAsync((o) => o.name === restaurant);
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

export default router;
