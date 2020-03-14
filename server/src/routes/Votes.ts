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
        const prevVoter = await voteDb.getAsync((v) => v.name === voter.name);
        if (prevVoter !== null){
            await voteDb.addAsync(voter);
        }
        else {
            await voteDb.updateAsync(
                (v) => v.name === voter.name,
                (prev) => voter);
        }
        return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// UPDATE
router.put('/', async (req: Request, res: Response) => {
    try {
        const vote = req.body as IVote;
        if (!vote) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        await voteDb.createOrUpdateAsync((v) => v.name === vote.name, vote);
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

// DELETE restaurant
router.delete('/:user/:restaurant', async (req: Request, res: Response) => {
    try {
        const { user, restaurant } = req.params as ParamsDictionary;
        if (!user || !restaurant) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        const vote = await voteDb.getAsync((v) => v.name === user);
        if (!vote){
            throw new Error('User not found');
        }
        const restaurantIndex = vote.restaurants.findIndex((p) => p.name === restaurant);
        if (restaurantIndex === -1){
            throw new Error('Restaurant not found');
        }
        vote.restaurants.splice(restaurantIndex, 1);
        await voteDb.updateAsync((v) => v.name === user, (prev) => vote);

        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

export default router;
