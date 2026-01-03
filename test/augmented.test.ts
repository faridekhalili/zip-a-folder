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

    it('tar default compression equals explicit high compression', async () => {

      /**
       * Sample 1:
       * ObjectLiteral
       * lib/ZipAFolder.ts:36:59
       * -           const o: ZipAFolderOptions = zipAFolderOptions || {
       * -               compression: COMPRESSION_LEVEL.high,
       * -           };
       * +           const o: ZipAFolderOptions = zipAFolderOptions || {};",
      * */

      const testDefaultTAR = path.resolve(__dirname, 'testDefault.tgz');
      const testHighTAR = path.resolve(__dirname, 'testHigh.tgz');
  
      // Call tar without passing any options (should default to high compression)
      await tar(path.resolve(__dirname, 'data/'), testDefaultTAR);
  
      // Call tar explicitly with high compression
      await tar(path.resolve(__dirname, 'data/'), testHighTAR, { compression: COMPRESSION_LEVEL.high });
  
      // Compare file sizes – they should be identical if the default is set to high compression.
      const sizeDefault = fs.statSync(testDefaultTAR).size;
      const sizeHigh = fs.statSync(testHighTAR).size;
  
      expect(sizeDefault).toEqual(sizeHigh);
    });
    
});

