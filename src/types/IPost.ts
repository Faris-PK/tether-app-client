// export default interface PostData {
//     private _id(_id: any): void;
//     createdAt: string | number | Date;
//     createdAt: string | number | Date;
//     title: any;
//     content: string;
//     audience: string;
//     file?: File | null; 
//     location?: string; 
//     postType: 'image' | 'video' |'note'; 
//   }
  

export default interface PostData {
  _id?: any; // or specify a specific type if possible, e.g., `string`
  createdAt: string | number | Date;
  title: any; // Specify a more specific type, like `string`, if possible
  content: string;
  audience: string;
  file?: File | null; 
  location?: string; 
  postType: 'image' | 'video' | 'note';
}
