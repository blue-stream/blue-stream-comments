export interface IComment {
    id?: string;
    resource: string;
    user: string;
    text: string;
    parent?: string | null;
}
