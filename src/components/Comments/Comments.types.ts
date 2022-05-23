export interface ICommentData {
    userId: string;
    commentId: string;
    fullName: string;
    avatarUrl: string;
    text: string;
    date: string;
    replies: ICommentData[];
}

export interface ICommentsProps {
    title: string;
    data: ICommentData[];
    onCommentPost: (text: string) => void;
    onReplyPost: (text: string, commentId: string) => void;
}
