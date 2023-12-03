export function converterToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const converter: FileReader = new FileReader();
    converter.readAsDataURL(file);
    converter.onload = (): void => resolve(converter.result as string);
    converter.onerror = (error: ProgressEvent<FileReader>): void =>
      reject(error);
  });
}
