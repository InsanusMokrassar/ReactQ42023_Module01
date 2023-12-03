import { boolean, mixed, number, object, string } from 'yup';

const validPictureExtensions = ['jpg', 'png', 'jpeg'];
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

function isValidFileType(fileType: string): boolean {
  return validPictureExtensions.includes(fileType);
}

export const formSchema = object({
  firstName: string()
    .required()
    .test((value) => {
      const firstLetter = value.substring(0, 1);

      return firstLetter == firstLetter.toUpperCase();
    }),
  age: number().integer().min(0).required(),
  email: string().email().required(),
  password: string().required(),
  passwordApprove: string()
    .test(
      'Password repetition requirements',
      'Passwords should be the same',
      (value, values) => {
        return values.parent['password'] == value;
      }
    )
    .required(),
  gender: number().integer().required(),
  accepted: boolean().default(false).required(),
  picture: mixed<FileList>()
    .required()
    .test(
      'Extension requirement',
      'File must have extension jpg/png/jpeg',
      (value) => {
        const file = value[0];
        return (
          file &&
          isValidFileType(file.name.substring(file.name.lastIndexOf('.') + 1))
        );
      }
    )
    .test('Size requirement', 'File size should be less than 5MB', (value) => {
      const file = value[0];
      return file && file.size <= MAX_FILE_SIZE;
    }),
  country: string().required(),
});
