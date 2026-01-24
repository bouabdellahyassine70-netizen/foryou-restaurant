export declare class UploadController {
    uploadImage(file: any): Promise<{
        url: string;
        filename: any;
        originalName: any;
        size: any;
    }>;
}
