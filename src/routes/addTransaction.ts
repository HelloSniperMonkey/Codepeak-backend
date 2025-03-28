import { Router, Request, Response } from 'express';
import { addTransaction, updateTransaction } from '../service/transaction';
import { authorization, mentorAuthorization } from '../service/auth';
const Leaderboard = require('../../models/Leaderboard');
const Transaction = require('../../models/Transactions');
const router = Router();

router.post('/add', authorization, mentorAuthorization, async (req: Request, res: Response) => {
    try {
        const { student, mentor, project, points, type, open } = req.body;
        const result = await addTransaction(student, mentor, project, points, type, open);
        
        if (!result.success) {
            res.status(400).json({ 
                message: result.message,
                error: result.error 
            });
            return
        }
        
        res.status(201).json({ message: result.message });
    } catch (error: any) {
        console.error("Error in add transaction route:", error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

router.post('/update', authorization, mentorAuthorization, async (req: Request, res: Response) => {
    try {
        const { student, project, points, open } = req.body;
        const result = await updateTransaction(student, project, points, open);
        
        if (!result.success) {
            res.status(400).json({ 
                message: result.message,
                error: result.error 
            });
            return
        }
        
        res.status(200).json({ message: result.message });
    } catch (error: any) {
        console.error("Error in update transaction route:", error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

router.get('/project', async (req: Request, res: Response) => {
    try {
        const { project } = req.query;
        
        if (!project) {
            res.status(400).json({ message: 'project parameters are required' });
            return
        }

        const transactions = await Transaction.find({
            deleteIndex: project
        });

        res.status(200).json({ 
            message: 'Transactions fetched successfully', 
            data: transactions 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch transactions', 
            error 
        });
    }
});

router.get('/student-project', async (req: Request, res: Response) => {
    try {
        const { student } = req.query;
        
        if (!student) {
            res.status(400).json({ message: 'student and project parameters are required' });
            return
        }

        const transactions = await Transaction.find({
            student: student,
        });

        res.status(200).json({ 
            message: 'Transactions fetched successfully', 
            data: transactions 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch transactions', 
            error 
        });
    }
});

router.get('/leaderboard', async (req: Request, res: Response) => {
    try {
        const leaderboard = await Leaderboard.find({})
            .sort({ points: -1 }) // Sort by points in descending order
            .limit(100); // Get top 10 students

        res.status(200).json({
            message: 'Leaderboard fetched successfully',
            data: leaderboard
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({
            message: 'Failed to fetch leaderboard',
            error
        });
    }
});

router.get('/counter', async (req,res) => {
	try{
        const count = await Transaction.countDocuments() 
        res.status(200).json({
            message: 'Counter fetched successfully',
            data: count
        });
    } catch (error) {
        console.error("Error fetching counter:", error);
        res.status(500).json({
            message: 'Failed to fetch counter',
            error: error || '',
        });
    }
})


export default router;
