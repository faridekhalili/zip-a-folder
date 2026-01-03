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
    
    it('zip default compression equals explicit high compression', async () => {
      
      /**
       * Sample 4:
       * ObjectLiteral
       * lib/ZipAFolder.ts:70:59
       * -           const o: ZipAFolderOptions = zipAFolderOptions || {
       * -               compression: COMPRESSION_LEVEL.high,\n-           };
       * +           const o: ZipAFolderOptions = zipAFolderOptions || {};",
       * 
      * */
      
      const testDefaultZIP = path.resolve(__dirname, 'testDefault.zip');
      const testHighZIP = path.resolve(__dirname, 'testHigh.zip');
  
      // Call zip without passing any options (should default to high compression)
      await zip(path.resolve(__dirname, 'data/'), testDefaultZIP);
  
      // Call zip explicitly with high compression
      await zip(path.resolve(__dirname, 'data/'), testHighZIP, { compression: COMPRESSION_LEVEL.high });
  
      // Compare file sizes – they should be identical if the default is set to high compression.
      const sizeDefault = fs.statSync(testDefaultZIP).size;
      const sizeHigh = fs.statSync(testHighZIP).size;
  
      expect(sizeDefault).toEqual(sizeHigh);
    });
    
});

