export interface IPresentationInitResponse {
  startingEntity: string; // örn: "0 -> Project"
  projectId: number;
  projectName: string | null;
  projectSlogan: string | null;
  startMode: string; // örn: "1 -> DayLight"
  themeObject: any | null; // tip bilinmiyor, detay verirsen güncelleyebilirim
  companyName: string | null;
  companyLogo: {
    id: number | null;
    url: string | null;
    filePath: string | null;
    fileName: string | null;
    fileVersion: number;
    order: number;
    altText: string | null;
  };
}
