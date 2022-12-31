import { body } from 'express-validator'

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
    body('fullName').isLength({min:3}),
    body('avatarUrl').optional().isString(),
];

export const editUser = [
    body('email').optional().isEmail(),
    body('fullName').optional().isLength({min:3}),
    body('avatarUrl').optional().isString(),
]

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
];

export const postCreateValidations = [
    body('title', 'Введите заголовок статьи').isLength({min:3}).isString(),
    body('text', 'Введите текст статьи').isLength({min:3}).isString(),
    body('tags', 'Неверный формат тегов (укажите масив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

export const commentsCreateValidations = [
    body('comment', 'Введите текст комментария').isLength({min:3}).isString(),
];
