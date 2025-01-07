// type of mock data set
export type FilesDataType = {
  fileId: string;
  fileName: string;
  attachedTask: string;
  size: string;
  uploadedBy: string;
  uploadedDate: Date;
};

// mock dataset
export const filesData: FilesDataType[] = [
  {
    fileId: 'f1',
    fileName: 'Screenshot 2024-11-05 080751.png',
    attachedTask: '[SP-1] UI rebuild',
    size: '50.75 KB',
    uploadedBy: 'Raveesha Dilanka',
    uploadedDate: new Date(),
  },
  {
    fileId: 'f2',
    fileName: 'Screenshot 2024-11-05 080751.png',
    attachedTask: '[SP-2] Requirements Analysis',
    size: '120.00 KB',
    uploadedBy: 'Raveesha Dilanka',
    uploadedDate: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    fileId: 'f3',
    fileName: 'Screenshot 2024-11-05 080751.png',
    attachedTask: '[SP-3] Report Compilation',
    size: '300.20 KB',
    uploadedBy: 'Sachintha Prasad',
    uploadedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    fileId: 'f4',
    fileName: 'Screenshot 2024-11-05 080751.png',
    attachedTask: '[SP-4] Wireframing',
    size: '75.80 KB',
    uploadedBy: 'Sachintha Prasad',
    uploadedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    fileId: 'f5',
    fileName: 'Screenshot 2024-11-05 080751.png',
    attachedTask: '[SP-5] Final Presentation',
    size: '85.50 KB',
    uploadedBy: 'Sachintha Prasad',
    uploadedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];
