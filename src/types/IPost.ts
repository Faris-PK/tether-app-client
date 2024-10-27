export default interface PostData {
    private _id(_id: any): void;
    createdAt: string | number | Date;
    createdAt: string | number | Date;
    title: any;
    content: string;
    audience: string;
    file?: File | null; 
    location?: string; 
    postType: 'image' | 'video' |'note'; 
  }
  