    import News from "../Interfaces/News";
    import { getImageUrl } from "./helper";


    const transformNewsAPi = async function(news: News) {
        return {
            id: news.id,
            heading: news.title,
            news: news.content,
            image: getImageUrl(news.image),
            created_at: news.created_at,
            reporter: {
                id: news.user?.id,
                name: news.user?.name,
                profile: news.user?.profile
                    ? getImageUrl(news.user.profile)  
                    : "/user_avatar.png" // if reporter's profile image is not there
            },
        };
    };
    
    export default transformNewsAPi;

