'use strict';
import 'jest-extended';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as path from 'path';
import {COMPRESSION_LEVEL, zip} from '../lib/ZipAFolder';

describe('Zip-A-Folder Test', function () {

    beforeAll(() => {
        rimraf.sync('test/*.tgz');
        rimraf.sync('test/*.tar');
        rimraf.sync('test/*.zip');
    });

    // it('zip should call compress with archiverOptions indicating store mode when compression is uncompressed', async () => {
      
    //   /**
    //    * Sample 6:
    //    * ConditionalExpression
    //    * lib/ZipAFolder.ts:74:13
    //    * -           if (o.compression === COMPRESSION_LEVEL.uncompressed) {
    //    * +           if (false) {",
    //    */
      
    //   // Spy on the internal compress method using the imported alias.
    //   const compressSpy = jest.spyOn(zipafolder as any, 'compress');
    //   const testZipPath = path.resolve(__dirname, 'testZipStoreOption.zip');
    
    //   // Call zip with COMPRESSION_LEVEL.uncompressed.
    //   await zip(path.resolve(__dirname, 'data/'), testZipPath, { compression: COMPRESSION_LEVEL.uncompressed });
    
    //   // Ensure compress was called.
    //   expect(compressSpy).toHaveBeenCalledTimes(1);
    
    //   // Retrieve the argument passed to compress.
    //   const compressArgs = compressSpy.mock.calls[0][0] as { archiverOptions?: any };
    
    //   // Check that the archiverOptions has the 'store' property set to true.
    //   expect(compressArgs.archiverOptions).toHaveProperty('store', true);
      
    //   // In the original code, even though archiver merges in its defaults (like zlib.level: 1),
    //   // we expect that the mutant (which would always take the 'else' branch)
    //   // would set the zlib.level to COMPRESSION_LEVEL.uncompressed (i.e. 0).
    //   // So we can assert that the zlib.level is not equal to 0.
    //   expect(compressArgs.archiverOptions.zlib.level).not.toEqual(COMPRESSION_LEVEL.uncompressed);
    
    //   // Clean up the spy.
    //   compressSpy.mockRestore();
    // });

    // it('zip should invoke compress for COMPRESSION_LEVEL.uncompressed', async () => {
      
    //   /**
    //    * Sample 1:
    //    * BlockStatement
    //    * lib/ZipAFolder.ts:74:63
    //    * -           if (o.compression === COMPRESSION_LEVEL.uncompressed) {
    //    * -               await ZipAFolder.compress({\n-                   src,
    //    * -                   targetFilePath: zipFilePath,
    //    * -                   format: 'zip',
    //    * -                   zipAFolderOptions,
    //    * -                   archiverOptions: {
    //    * -                       store: true,
    //    * -                   },
    //    * -               });
    //    * -           } else {
    //    * +           if (o.compression === COMPRESSION_LEVEL.uncompressed) {} else {",
    //   * */
      
    //   // Spy on the internal compress method
    //   const compressSpy = jest.spyOn(zipafolder as any, 'compress');
    //   const testZipPath = path.resolve(__dirname, 'testZipCompressCalled.zip');
      
    //   await zip(path.resolve(__dirname, 'data/'), testZipPath, { compression: COMPRESSION_LEVEL.uncompressed });
      
    //   // In the original code, compress should have been called once.
    //   expect(compressSpy).toHaveBeenCalledTimes(1);
      
    //   // Clean up the spy
    //   compressSpy.mockRestore();
    // });

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

