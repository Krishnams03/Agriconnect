export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
  
  export interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    author: {
      name: string;
      image?: string;
    };
    createdAt: string;
  }
  
  export interface Comment {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: string;
  }