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

    it('tar should invoke compress for COMPRESSION_LEVEL.uncompressed', async () => {
      
      /** 
       * Sample 3:
       * BlockStatement
       * lib/ZipAFolder.ts:40:63
       * -           if (o.compression === COMPRESSION_LEVEL.uncompressed) {
       * -               await ZipAFolder.compress({src, targetFilePath: tarFilePath, format: 'tar', zipAFolderOptions});
       * -           } else {
       * +           if (o.compression === COMPRESSION_LEVEL.uncompressed) {} else {",
      * */
      
      // Spy on the internal compress method
      const compressSpy = jest.spyOn(zipafolder as any, 'compress');
      const testTarPath = path.resolve(__dirname, 'testCompressCalled.tar');
      
      await tar(path.resolve(__dirname, 'data/'), testTarPath, { compression: COMPRESSION_LEVEL.uncompressed });
      
      // In the original code, compress should have been called once.
      expect(compressSpy).toHaveBeenCalledTimes(1);
      
      // Clean up the spy
      compressSpy.mockRestore();
    });
    
});

