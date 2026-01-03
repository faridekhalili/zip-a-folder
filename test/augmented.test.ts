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

    it('zip should invoke compress for COMPRESSION_LEVEL.uncompressed', async () => {
      
      /**
       * Sample 6:
       * BlockStatement
       * lib/ZipAFolder.ts:74:63
       * -           if (o.compression === COMPRESSION_LEVEL.uncompressed) {
       * -               await ZipAFolder.compress({\n-                   src,
       * -                   targetFilePath: zipFilePath,
       * -                   format: 'zip',
       * -                   zipAFolderOptions,
       * -                   archiverOptions: {
       * -                       store: true,
       * -                   },
       * -               });
       * -           } else {
       * +           if (o.compression === COMPRESSION_LEVEL.uncompressed) {} else {",
      * */
      
      // Spy on the internal compress method
      const compressSpy = jest.spyOn(zipafolder as any, 'compress');
      const testZipPath = path.resolve(__dirname, 'testZipCompressCalled.zip');
      
      await zip(path.resolve(__dirname, 'data/'), testZipPath, { compression: COMPRESSION_LEVEL.uncompressed });
      
      // In the original code, compress should have been called once.
      expect(compressSpy).toHaveBeenCalledTimes(1);
      
      // Clean up the spy
      compressSpy.mockRestore();
    });
});

