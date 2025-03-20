export interface Paper {
    id?: string;         // Firestoreで自動付与されるID
    userId: string;      // このドキュメントを作成したユーザーのUID
    authors: string[];   // 著者名の配列
    pdfUrl: string;      // PDFファイルのダウンロードURL
    createdAt: number;   // 登録日時 (UNIXタイムなど)
  }
  