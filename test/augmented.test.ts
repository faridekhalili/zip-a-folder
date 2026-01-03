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

    it('tar with uncompressed option should produce a non-gzipped tar file', async () => {
      
      /**
       * Sample 3:
       * ConditionalExpression
       * lib/ZipAFolder.ts:40:13
       * -           if (o.compression === COMPRESSION_LEVEL.uncompressed) {
       * +           if (false) {",
      * */
      
      const testUncompressedTar = path.resolve(__dirname, 'testMutated.tar');
      await tar(path.resolve(__dirname, 'data/'), testUncompressedTar, { compression: COMPRESSION_LEVEL.uncompressed });
      
      // Read the first two bytes of the file to check for a gzip signature (0x1F, 0x8B)
      const buffer = fs.readFileSync(testUncompressedTar);
      const isGzipped = buffer[0] === 0x1F && buffer[1] === 0x8B;
      
      expect(isGzipped).toBe(false);
    });
    
});

