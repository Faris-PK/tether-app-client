export default interface PostData {
    content: string;
    audience: string;
    file?: File | null; 
    location?: string; 
    postType: 'image' | 'video' |'note'; 
  }
  