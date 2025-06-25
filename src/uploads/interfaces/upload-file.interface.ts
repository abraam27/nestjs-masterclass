import { FileTypes } from '../enums/file-types.enums';
export interface UploadFile {
  name: string;
  path: string;
  type: FileTypes;
  mime_type: string;
  size: number;
}
