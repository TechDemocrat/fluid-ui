import React, { useState } from 'react';
import styles from '../Comments.module.scss';
import { Button } from '../../Button/Button';
import { ProfileImage } from '../../ProfileImage/ProfileImage';
import { Input } from '../../Input/Input';

interface Props {
    comment?: string;
    onCommentPost: (text: string) => void;
    onCommentCancelHandler: () => void;
}

function Editor(props: Props) {
    const { onCommentCancelHandler, onCommentPost } = props;

    const [comment, setComment] = useState<string>('');

    const onCommentTextChangeHandler = (text: string | number) => {
        setComment(text + '');
    };

    const onCancelClickHandler = () => {
        onCommentCancelHandler();
        setComment('');
    };

    return (
        <>
            <div className={styles.commentEditor}>
                <div className={styles.userIcon}>
                    <ProfileImage size="small" title="Mani" src="" />
                </div>
                <div className={styles.commentInput}>
                    <Input
                        size="small"
                        type="textarea"
                        value={comment}
                        placeholder="Write a comment..."
                        onChange={onCommentTextChangeHandler}
                        width="100%"
                        showIcon={false}
                    />
                </div>
            </div>
            {comment !== '' && (
                <div className={styles.commentAction}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={onCancelClickHandler}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            onCommentPost(comment);
                        }}
                    >
                        Post
                    </Button>
                </div>
            )}
        </>
    );
}

export default Editor;
