"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const transformNewsAPi = async function (news) {
    return {
        id: news.id,
        heading: news.title,
        news: news.content,
        image: (0, helper_1.getImageUrl)(news.image),
        created_at: news.created_at,
        reporter: {
            id: news.user?.id,
            name: news.user?.name,
            profile: news.user?.profile
                ? (0, helper_1.getImageUrl)(news.user.profile)
                : "/user_avatar.png" // if reporter's profile image is not there
        },
    };
};
exports.default = transformNewsAPi;
