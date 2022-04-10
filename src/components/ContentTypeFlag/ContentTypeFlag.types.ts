export enum EContentType {
    VIDEO = 'VIDEO',
    BLOG = 'BLOG',
    MUSIC = 'MUSIC',
    PODCAST = 'PODCAST',
    PHOTO = 'PHOTO',
}

export interface IContentTypeFlagProps {
    type: EContentType;
}
