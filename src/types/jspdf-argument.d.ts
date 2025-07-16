declare module "jspdf" {
  interface jsPDF {
    internal: {
      getCurrentPageInfo: () => { pageNumber: number };
      getNumberOfPages: () => number;
    } & jsPDF['internal']; // Merge with existing internal type
  }
}