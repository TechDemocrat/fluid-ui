import React, { useState } from 'react';
import styles from '../Comments.module.scss';
import { Button } from '../../Button/Button';
import { EInputSize } from '../../Input/Input.types';
import { ProfileImage } from '../../ProfileImage/ProfileImage';
import { TextArea } from '../../TextArea/TextArea';

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
                    <TextArea
                        size={EInputSize.AUTO}
                        value={comment}
                        placeholder="Write a comment..."
                        onChange={onCommentTextChangeHandler}
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
