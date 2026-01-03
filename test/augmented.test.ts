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

    it('zip should call compress with archiverOptions indicating store mode when compression is uncompressed', async () => {
      
      /**
       * Sample 5:
       * ConditionalExpression
       * lib/ZipAFolder.ts:74:13
       * -           if (o.compression === COMPRESSION_LEVEL.uncompressed) {
       * +           if (false) {",
       */
      
      // Spy on the internal compress method using the imported alias.
      const compressSpy = jest.spyOn(zipafolder as any, 'compress');
      const testZipPath = path.resolve(__dirname, 'testZipStoreOption.zip');
    
      // Call zip with COMPRESSION_LEVEL.uncompressed.
      await zip(path.resolve(__dirname, 'data/'), testZipPath, { compression: COMPRESSION_LEVEL.uncompressed });
    
      // Ensure compress was called.
      expect(compressSpy).toHaveBeenCalledTimes(1);
    
      // Retrieve the argument passed to compress.
      const compressArgs = compressSpy.mock.calls[0][0] as { archiverOptions?: any };
    
      // Check that the archiverOptions has the 'store' property set to true.
      expect(compressArgs.archiverOptions).toHaveProperty('store', true);
      
      // In the original code, even though archiver merges in its defaults (like zlib.level: 1),
      // we expect that the mutant (which would always take the 'else' branch)
      // would set the zlib.level to COMPRESSION_LEVEL.uncompressed (i.e. 0).
      // So we can assert that the zlib.level is not equal to 0.
      expect(compressArgs.archiverOptions.zlib.level).not.toEqual(COMPRESSION_LEVEL.uncompressed);
    
      // Clean up the spy.
      compressSpy.mockRestore();
    });
    
});

