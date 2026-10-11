const test = require('node:test');
const assert = require('node:assert/strict');
const { buggyRegistration } = require('./buggyRegistration');
const { fixedRegistration } = require('./fixedRegistration');

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const createAccount = async (email) => ({ uid: 'test-user-123', email });

test('reproduces the original defect: registration succeeds before profile initialization', async () => {
  const profile = deferred();
  let profileReady = false;
  const initializeProfile = () => profile.promise.then(() => { profileReady = true; });
  const result = await buggyRegistration(createAccount, initializeProfile, 'example@test.com');
  assert.equal(result.success, true);
  assert.equal(profileReady, false);
  profile.resolve();
  await profile.promise;
});

test('regression: fixed registration waits for profile initialization', async () => {
  const profile = deferred();
  let profileReady = false;
  const initializeProfile = () => profile.promise.then(() => { profileReady = true; });
  const pending = fixedRegistration(createAccount, initializeProfile, 'example@test.com');
  let settled = false;
  pending.then(() => { settled = true; }, () => { settled = true; });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(settled, false);
  profile.resolve();
  const result = await pending;
  assert.equal(result.success, true);
  assert.equal(profileReady, true);
});

test('regression: fixed registration propagates backend initialization failure', async () => {
  const initializeProfile = async () => { throw new Error('Profile initialization failed'); };
  await assert.rejects(
    fixedRegistration(createAccount, initializeProfile, 'example@test.com'),
    /Profile initialization failed/
  );
});
