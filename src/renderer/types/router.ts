// Type definitions for the tRPC router
// This avoids importing from the main process during renderer build

export type AppRouter = {
  getSettings: any;
  updateSettings: any;
  analyzeFile: any;
  batchAnalyze: any;
  renameFile: any;
  batchRename: any;
  validateFileName: any;
  getHistory: any;
  undoRename: any;
  getTemplates: any;
  createTemplate: any;
  deleteTemplate: any;
};
