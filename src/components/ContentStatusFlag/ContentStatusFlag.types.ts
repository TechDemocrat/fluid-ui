export enum EContentStatusType {
    ON_AIR = 'ON_AIR',
    DRAFT = 'DRAFT',
    UPLOADING = 'UPLOADING',
    DELETED = 'DELETED',
    UNPUBLISHED = 'UNPUBLISHED',
    SCHEDULED = 'SCHEDULED',
}

export interface IContentStatusFlagProps {
    type: EContentStatusType;
}
