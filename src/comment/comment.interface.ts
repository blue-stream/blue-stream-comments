export interface IComment {
    id?: string;
    video: string;
    user: string;
    text: string;
    parent?: string | null;
}
