import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось создать статью',
        })
    };
}



export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось получить статьи',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').sort({createdAt:-1}).exec();

        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось получить статьи',
        })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').filter(items => items.user._id ).exec();

        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось получить статьи',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(req)



        PostModel.findByIdAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалаось вернуть статью',
                    })
                }

                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    })
                }

                res.json(doc);
            }

        ).populate('user')

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось создать статью',
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },

            (err, doc) => {
                if (err) { 
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалаось удалить статью',
                    })
                }

                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    })
                }

                res.json({
                    success: true,
                })
            },
        )
    } catch (err) {
        console.log(err)
         res.status(500).json({
            message: 'Не удалаось получить статьи',
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId, "postId")

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                user: req.userId,  
            },
        )
        res.json({
            success:true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалаось обновить статью',
        })
    }
}