import React from 'react';
import { ContentActionGroup } from '../../ContentActionGroup/ContentActionGroup';
import { ProfileImage } from '../../ProfileImage/ProfileImage';
import { TimeFromNow } from '../../TimeFromNow/TimeFromNow';
import cn from 'classnames';
import styles from '../Comments.module.scss';
import { ICommentData } from '../Comments.types';

interface Props {
    comment: ICommentData;
    viewReplyId: string;
    onReplyClickHandler: (commentId: string) => void;
    onViewReplyClickHandler: (commentId: string) => void;
}

function Viewer(props: Props) {
    const { comment, viewReplyId, onReplyClickHandler, onViewReplyClickHandler } = props;

    return (
        <div className={cn(styles.comments)}>
            <ProfileImage size="small" title={comment.fullName} src={comment.avatarUrl} />
            <div className={cn(styles.commentContent)}>
                <div className={cn(styles.commentContentAuthor)}>
                    <span className={cn(styles.commentAuthorName)}>{comment.fullName}</span>
                    <span className={cn(styles.commentAuthorDate)}>
                        <TimeFromNow dateString={comment.date} />
                    </span>
                </div>
                <div className={cn(styles.commentContentText)}>{comment.text}</div>
                <div className={cn(styles.commentContentAction)}>
                    <ContentActionGroup
                        size="small"
                        options={{
                            love: {
                                active: true,
                                onClick: () => {},
                            },
                            reply: {
                                onClick: () => onReplyClickHandler(comment.commentId),
                            },
                        }}
                    />
                </div>
                {comment.replies && comment.replies.length > 0 && (
                    <div className={cn(styles.commentContentViewAll)}>
                        <span onClick={() => onViewReplyClickHandler(comment.commentId)}>
                            {viewReplyId === comment.commentId ? 'Hide Replies' : 'View Replies'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Viewer;
