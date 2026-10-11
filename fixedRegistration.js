// Independently reconstructed example of the corrected registration flow.
async function fixedRegistration(createAccount, initializeProfile, email) {
  const user = await createAccount(email);
  await initializeProfile(user);
  return { success: true, user };
}
module.exports = { fixedRegistration };
