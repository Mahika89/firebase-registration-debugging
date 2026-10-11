// Independently reconstructed example of the original race condition.
async function buggyRegistration(createAccount, initializeProfile, email) {
  const user = await createAccount(email);
  initializeProfile(user); // Missing await: profile creation may still be running.
  return { success: true, user };
}
module.exports = { buggyRegistration };
