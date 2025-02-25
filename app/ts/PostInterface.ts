interface Author {
    image: string;
    username: string;
    profilePic: string | null;
}

export interface Post {
    id: string;
    caption: string;
    imageUrl: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author: Author;
    likes: any[]; // Adjust type based on like structure if needed
    comments: any[]; // Adjust type based on comment structure if needed
}
