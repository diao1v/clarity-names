import * as fs from 'fs';
import * as path from 'path';
import { db } from '../db';
import { renameHistory } from '../db/schema';

export interface RenameOperation {
  originalPath: string;
  newPath: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export class FileService {
  async renameFile(originalPath: string, newName: string): Promise<RenameOperation> {
    try {
      const dir = path.dirname(originalPath);
      const ext = path.extname(originalPath);
      const newPath = path.join(dir, newName + ext);

      // Check if target file already exists
      if (fs.existsSync(newPath)) {
        return {
          originalPath,
          newPath,
          status: 'error',
          error: 'File already exists',
        };
      }

      // Rename the file
      fs.renameSync(originalPath, newPath);

      // Record in history
      await db.insert(renameHistory).values({
        originalPath,
        newPath,
        timestamp: new Date(),
        aiModel: null,
        prompt: null,
      });

      return {
        originalPath,
        newPath,
        status: 'success',
      };
    } catch (error) {
      return {
        originalPath,
        newPath: '',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async batchRename(operations: Array<{ path: string; newName: string }>): Promise<RenameOperation[]> {
    const results: RenameOperation[] = [];

    for (const op of operations) {
      const result = await this.renameFile(op.path, op.newName);
      results.push(result);
    }

    return results;
  }

  async undoRename(historyId: number): Promise<boolean> {
    try {
      const history = await db.query.renameHistory.findFirst({
        where: (h, { eq }) => eq(h.id, historyId),
      });

      if (!history) {
        return false;
      }

      // Check if the renamed file still exists
      if (!fs.existsSync(history.newPath)) {
        return false;
      }

      // Rename back to original
      fs.renameSync(history.newPath, history.originalPath);

      return true;
    } catch (error) {
      console.error('Undo failed:', error);
      return false;
    }
  }

  resolveConflict(originalPath: string, newName: string, strategy: 'append' | 'replace'): string {
    const dir = path.dirname(originalPath);
    const ext = path.extname(originalPath);
    let finalPath = path.join(dir, newName + ext);

    if (strategy === 'append' && fs.existsSync(finalPath)) {
      let counter = 1;
      while (fs.existsSync(path.join(dir, `${newName}-${counter}${ext}`))) {
        counter++;
      }
      finalPath = path.join(dir, `${newName}-${counter}${ext}`);
    }

    return finalPath;
  }

  validateFileName(name: string): { valid: boolean; error?: string } {
    // Check for invalid characters
    const invalidChars = /[<>:"|?*\x00-\x1f]/;
    if (invalidChars.test(name)) {
      return { valid: false, error: 'Filename contains invalid characters' };
    }

    // Check length
    if (name.length === 0) {
      return { valid: false, error: 'Filename cannot be empty' };
    }

    if (name.length > 255) {
      return { valid: false, error: 'Filename is too long' };
    }

    return { valid: true };
  }
}

export const fileService = new FileService();
