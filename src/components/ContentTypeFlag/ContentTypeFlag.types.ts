export enum EContentType {
    VIDEO,
    BLOG,
    MUSIC,
    PODCAST,
    PHOTO,
}

export interface IContentTypeFlagProps {
    /**
     * @default EContentType.VIDEO
     */
    type?: EContentType;
}
