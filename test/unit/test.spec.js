import * as util from "../../src/util/index.js";

import { expect, assert } from "chai";

import Joi from "joi";

import * as validations from "../../src/validations/index.js";
const { fields } = validations;

describe(`util`, function () {
  it(`pick.js`, function () {
    expect(util.pick({ a: 1, b: 2, c: 3 }, [`a`, `b`])).to.deep.equal({ a: 1, b: 2 });
  });

  it(`getCallerDir.js`, function () {
    expect(() => util.getCallerDir()).to.throw(`not provided`);
    // No filepath can't be equal to symbol. So, this file path should return the current file path
    expect(util.getCallerDir({})).to.equal(import.meta.url);
    expect(import.meta.url).to.startWith(util.getCallerDir({}, 1, false));
  });

  describe(`time`, function() {
    it(`startTime`, function() {
      // This isn't a great test, only for coverage really
      expect(util.time.startTime()).to.match(/00:\d\d:\d\d/);
      expect(util.time.startTime(Date.now())).to.match(/00:\d\d:\d\d/);
    });
    it(`localeTime`, function() {
      expect(util.time.localeTime()).to.match(/\d\d:\d\d:\d\d/);
      expect(util.time.localeTime(Date.now())).to.match(/\d\d:\d\d:\d\d/);
    });
  });

  describe(`DSA`, function () {
    describe(`lcs.js`, function () {
      const lcs = util.DSA.lcs;
      it(`LCSFromStart`, function () {
        const L = lcs.LCSFromStart;

        expect(L(`a`)).to.equal(1);
        expect(L(`ab`)).to.equal(2);
        expect(L(`ab`, ``)).to.equal(0);
        expect(L(`ab`, `abcde`)).to.equal(2);
        expect(L(`ab`, `bcdefa`)).to.equal(0);
        expect(L(`ab`, `abc`, `abcde`)).to.equal(2);
      });
    });
  });

  describe(`isMain`, function () {
    it(`should work`, function () {
      expect(() => util.isMain()).to.throw(/required/i);
      expect(util.isMain(import.meta)).to.be.false;
    });
  });

  describe(`normalize`, function () {
    it(`should work`, function () {
      expect(util.normalize(`Crème Brulée`)).to.equal(`creme brulee`);
    });
  });

  describe(`catchAsync`, function () {
    it(`should work`, async function () {
      const fn = async () => {
        throw new Error(`test`);
      };
      const func = chai.spy(() => {});
      const err = await util.catchAsync(fn)(1, 1, func);
      await expect(func).to.have.been.called();
    });
  });

  describe(`nullWrapper`, function () {
    it(`should work`, function () {
      expect(util.nullWrapper(() => {
        throw Error(`test`);
      })).to.equal(null);
      expect(util.nullWrapper(() => {
        return 1;
      })).to.equal(1);
    });
  });

  describe(`async`, function () {
    describe(`sleep.js`, function () {
      it(`should work`, async function () {
        const start = Date.now();
        await util.async.sleep(2);
        const end = Date.now();
        expect(end - start).to.be.least(1);
      });
    });
  });

  describe(`randomIdentifier.js`, function () {
    it(`should work`, function () {
      expect(util.randomIdentifier()).to.be.a(`string`);
      const arr = Array.from({ length: 4 }, util.randomIdentifier);
      // length should be the same, or it is not unique
      expect(arr.length).to.equal(new Set(arr).size);
    });
  });

});

function validationFactory(fieldname, passing, failing, validator) {
  describe(`validation for ${fieldname}`, function () {
    it(`Should pass passing usernames`, function () {
      for (const pass of passing) {
        expect(Joi.string().custom(validator).validate(pass), `expected '${pass}' to be a valid ${fieldname}`).to.not.have.property(`error`);
      }
    });
    it(`Should not pass invalid usernames`, function () {
      for (const fail of failing) {
        expect(Joi.string().custom(validator).validate(fail), `expected '${fail}' to not be a valid ${fieldname}`).to.have.property(`error`);
      }
    });
  });
}

describe(`validations`, function () {
  describe(`field`, function () {
    validationFactory(`username`, [
      `abcdsaif`,
      `the_best_cookie`,
      `the_arda_candy`,
    ], [
      `thonk me`,
      `interest-name`,
      `0best0`,
      `adoifajvaejfiajdsfjiaesjfioaewjfojasilfjaeioswfj`,
    ], fields.username);
    validationFactory(`password`, [
      `akfjioefklsdfjio123`,
      `thebestp@ssw0rd`,
    ], [
      `correcthorsebatterystaple`,
      `tooshort`,
      `12345678`,
      `!()*()#$)(#)@#)$`,
    ], fields.password);
  });
});
