'use strict';
import 'jest-extended';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as path from 'path';
import {COMPRESSION_LEVEL, tar, zip, ZipAFolder as zipafolder} from '../lib/ZipAFolder';

describe('Zip-A-Folder Test', function () {

    beforeAll(() => {
        rimraf.sync('test/*.tgz');
        rimraf.sync('test/*.tar');
        rimraf.sync('test/*.zip');
    });

    it('zip with uncompressed compression should set compression method to 0 (store) in the local file header', async () => {
      
       /**
       * Sample 7:
       * ObjectLiteral
       * lib/ZipAFolder.ts:80:34
       * -                   archiverOptions: {
       * -                       store: true,
       * -                   },
       * +                   archiverOptions: {},",
      * */

       /**
       * Sample 8:
       * BooleanLiteral
       * lib/ZipAFolder.ts:81:28
       * -                       store: true,
       * +                       store: false,"
      */
      
      // Setup: create a temporary directory with a simple file.
      const tmpDir = path.resolve(__dirname, 'tempZipHeaderTest');
      fs.mkdirSync(tmpDir, { recursive: true });
      const testFile = path.join(tmpDir, 'file.txt');
      fs.writeFileSync(testFile, 'This is a test file to check ZIP header for store method.');
      
      const testZipPath = path.resolve(__dirname, 'testZipHeader.zip');
      
      // Call zip with uncompressed mode.
      await zip(tmpDir, testZipPath, { compression: COMPRESSION_LEVEL.uncompressed });
      
      // Read the resulting zip file into a buffer.
      const buffer = fs.readFileSync(testZipPath);
      
      // Locate the first local file header using its signature "PK\x03\x04".
      const localFileHeaderSignature = Buffer.from([0x50, 0x4B, 0x03, 0x04]);
      const headerIndex = buffer.indexOf(localFileHeaderSignature);
      expect(headerIndex).toBeGreaterThan(-1);
      
      // In a ZIP local file header, the compression method is stored in 2 bytes at offset 8.
      const compressionMethod = buffer.readUInt16LE(headerIndex + 8);
      
      // For the store method (uncompressed), the compression method should be 0.
      expect(compressionMethod).toEqual(0);
      
      // Cleanup temporary directory.
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
    
});

