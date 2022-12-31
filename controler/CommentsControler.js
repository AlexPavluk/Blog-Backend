import CommentModel from "../models/Comment.js";

export const createComment = async (req, res) => {
    
    try {

        const postId = req.body.post;

        const doc = new CommentModel({
            comment: req.body.comment,
            user: req.userId,
            post: postId,
        });



        const comments = await doc.save();

        res.json(comments)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось создать статью',
        })
    };
}


export const getComment = async (req, res) => {
    try {
        const getComments = await CommentModel.find().populate('user').exec();

        res.json(getComments);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось получить статьи',
        })
    }
}