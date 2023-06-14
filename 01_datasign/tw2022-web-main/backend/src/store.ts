import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

const TBL_NM_VERIFIED_DIDS = "verified_dids";
// todo スキーマは暫定(有効期間など追加されるかも)
const DDL_VERIFIED_DIDS = `CREATE TABLE ${TBL_NM_VERIFIED_DIDS} (did VARCHAR(1024), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`;

const TBL_NM_HOLDERS_PROFILE = "holders_op";
const DDL_HOLDERS_PROFILE = `CREATE TABLE ${TBL_NM_HOLDERS_PROFILE} (profile JSON, expire INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`;

const DDL_MAP: { [key: string]: string } = {
  [TBL_NM_VERIFIED_DIDS]: DDL_VERIFIED_DIDS,
  [TBL_NM_HOLDERS_PROFILE]: DDL_HOLDERS_PROFILE,
};

// https://github.com/kriasoft/node-sqlite
const openDb = (() => {
  // https://github.com/TryGhost/node-sqlite3/wiki/Caching
  let _db: Database;
  return async () => {
    if (!_db) {
      const filepath = process.env["DATABASE_FILEPATH"];
      if (typeof filepath === "undefined") {
        throw new Error("DATABASE_FILEPATH envvar not defined");
      }
      _db = await open({
        filename: filepath,
        driver: sqlite3.cached.Database,
      });
    }
    return _db;
  };
})();

const checkIfTableExists = async (table_name: string) => {
  try {
    const db = await openDb();
    const result = await db.get<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${table_name}';`
    );
    return result?.name === table_name;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const createDb = async () => {
  const db = await openDb();
  for (const [key, value] of Object.entries(DDL_MAP)) {
    const b = await checkIfTableExists(key);
    if (!b) {
      console.debug(`create table ${key}`);
      await db.exec(value);
      console.debug("done");
    }
  }
};

const destroyDb = async () => {
  const db = await openDb();
  for (const [key, _] of Object.entries(DDL_MAP)) {
    const b = await checkIfTableExists(key);
    if (b) {
      console.debug(`drop table ${key}`);
      await db.exec(`DROP TABLE ${key}`);
      console.debug("done");
    }
  }
};

const insertVerifiedDID = async (did: string) => {
  try {
    const db = await openDb();
    return await db.run(
      `INSERT INTO ${TBL_NM_VERIFIED_DIDS} (did) VALUES (?)`,
      did
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save data.");
  }
};
const deleteVerifiedDID = async (did: string) => {
  try {
    const db = await openDb();
    return await db.run(
      `DELETE FROM ${TBL_NM_VERIFIED_DIDS} WHERE did = ?`,
      did
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete data.");
  }
};

export interface VerifiedAsNotBotDID {
  rowid: number;
  did: string;
  createdAt: string;
}

const selectVerifiedDID = async (did: string) => {
  try {
    const db = await openDb();
    return await db.get<VerifiedAsNotBotDID>(
      `SELECT rowid, did, created_at FROM ${TBL_NM_VERIFIED_DIDS} WHERE did = ? ORDER BY created_at DESC, rowid DESC`,
      did
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save data.");
  }
};

export interface HolderInfo {
  holderProfile: object;
  expire: number;
}

const insertHoldersProfile = async (holderInfo: HolderInfo) => {
  try {
    const db = await openDb();
    return await db.run(
      `INSERT INTO ${TBL_NM_HOLDERS_PROFILE} (expire,profile) VALUES (?,?)`,
      holderInfo.expire,
      JSON.stringify(holderInfo.holderProfile)
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save data.");
  }
};

export interface HolderProfile {
  rowid: number;
  profile: string;
  created_at: Date;
  expire: number;
}

const selectALLHolderProfile = async (): Promise<HolderProfile[]> => {
  try {
    const db = await openDb();
    return await db.all<HolderProfile[]>(
      `SELECT rowid, expire, profile, created_at FROM ${TBL_NM_HOLDERS_PROFILE} ORDER BY created_at DESC, rowid DESC`
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed select all holder profiles.");
  }
};

const selectHolderProfile = async (id: number) => {
  try {
    const db = await openDb();
    return await db.get<HolderProfile>(
      `SELECT  rowid, expire, profile, created_at FROM ${TBL_NM_HOLDERS_PROFILE} WHERE rowid = ? ORDER BY created_at DESC, rowid DESC`,
      id
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed select holder profile.");
  }
};
const deleteHolderProfile = async (id: number) => {
  try {
    const db = await openDb();
    return await db.run(
      `DELETE FROM ${TBL_NM_HOLDERS_PROFILE} WHERE rowid = ?`,
      id
    );
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete data.");
  }
};

export default {
  createDb,
  destroyDb,
  insertVerifiedDID,
  deleteVerifiedDID,
  selectVerifiedDID,
  insertHoldersProfile,
  selectALLHolderProfile,
  selectHolderProfile,
  deleteHolderProfile,
};
