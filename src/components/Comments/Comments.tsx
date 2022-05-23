import React, { useState } from 'react';
import cn from 'classnames';
import { ICommentsProps } from './Comments.types';
import styles from './Comments.module.scss';
import Editor from './components/Editor';
import Viewer from './components/Viewer';

export const Comments = (props: ICommentsProps) => {
    // props
    const { title, data, onCommentPost, onReplyPost } = props;
    const [editId, setEditId] = useState<string>('');
    const [viewReplyId, setViewReplyId] = useState<string>('');

    const onReplyClickHandler = (id: string) => {
        setEditId(id);
    };

    const onCommentCancelHandler = () => {
        setEditId('');
    };

    const onViewReplyClickHandler = (id: string) => {
        if (id === viewReplyId) {
            setViewReplyId('');
        } else {
            setViewReplyId(id);
        }
    };

    const onCommentReplyUpdateHandler = (text: string) => {
        onReplyPost(text, editId);
    };

    // paint
    return (
        <>
            <div className={cn(styles.wrapper)} title={title}>
                <div className={cn(styles.commentEditorWrapper)}>
                    <div className={styles.title}>Comments(10)</div>
                    <Editor
                        onCommentCancelHandler={onCommentCancelHandler}
                        onCommentPost={onCommentPost}
                    />
                </div>
                {data.map((eachComment) => {
                    return (
                        <>
                            <Viewer
                                comment={eachComment}
                                viewReplyId={viewReplyId}
                                onReplyClickHandler={onReplyClickHandler}
                                onViewReplyClickHandler={onViewReplyClickHandler}
                            />
                            {editId === eachComment.commentId && (
                                <div className={cn(styles.commentEdit)}>
                                    <Editor
                                        comment=""
                                        onCommentCancelHandler={onCommentCancelHandler}
                                        onCommentPost={onCommentReplyUpdateHandler}
                                    />
                                </div>
                            )}
                            <div className={cn(styles.commentReplies)}>
                                {viewReplyId === eachComment.commentId &&
                                    eachComment?.replies?.map((eachReply) => {
                                        return (
                                            <>
                                                <Viewer
                                                    comment={eachReply}
                                                    viewReplyId={viewReplyId}
                                                    onReplyClickHandler={onReplyClickHandler}
                                                    onViewReplyClickHandler={
                                                        onViewReplyClickHandler
                                                    }
                                                />
                                                {editId === eachReply.commentId && (
                                                    <div className={cn(styles.commentEdit)}>
                                                        <Editor
                                                            comment=""
                                                            onCommentCancelHandler={
                                                                onCommentCancelHandler
                                                            }
                                                            onCommentPost={
                                                                onCommentReplyUpdateHandler
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                            </div>
                        </>
                    );
                })}
            </div>
        </>
    );
};
