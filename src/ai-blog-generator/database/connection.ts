/**
 * Database connection management
 * 
 * Handles SQLite database connection using better-sqlite3.
 */

import Database from 'better-sqlite3';
import { SCHEMA_SQL } from './schema';
import * as fs from 'fs';
import * as path from 'path';

export class DatabaseConnection {
  private db: Database.Database | null = null;

  constructor(private dbPath: string) {}

  /**
   * Initialize the database connection and create tables if needed
   */
  async initialize(): Promise<void> {
    // Ensure the directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Open database connection
    this.db = new Database(this.dbPath);
    
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
    
    // Create tables and indexes
    this.db.exec(SCHEMA_SQL);
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Execute a SQL statement (INSERT, UPDATE, DELETE)
   * Returns the result info (changes, lastInsertRowid)
   */
  async execute(sql: string, params?: any[]): Promise<Database.RunResult> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    const stmt = this.db.prepare(sql);
    return stmt.run(...(params || []));
  }

  /**
   * Query the database (SELECT)
   * Returns an array of rows
   */
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    const stmt = this.db.prepare(sql);
    return stmt.all(...(params || [])) as T[];
  }

  /**
   * Query a single row
   * Returns a single row or undefined
   */
  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    const stmt = this.db.prepare(sql);
    return stmt.get(...(params || [])) as T | undefined;
  }

  /**
   * Execute multiple statements in a transaction
   */
  async transaction<T>(fn: () => T): Promise<T> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return this.db.transaction(fn)();
  }

  /**
   * Get the underlying database instance (for advanced usage)
   */
  getDb(): Database.Database {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }
}
