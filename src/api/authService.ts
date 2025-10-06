import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "./firebaseConfig";

let confirmationResult: ConfirmationResult | null = null;

// Recaptcha setup
export function setupRecaptcha(containerId: string) {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible", // ya "normal"
    callback: (response: any) => {
      console.log("Recaptcha resolved:", response);
    },
  });
}

// Send OTP
export async function sendOTP(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Verify OTP
export async function verifyOTP(code: string) {
  if (!confirmationResult) {
    return { success: false, message: "OTP request not found" };
  }

  try {
    const result = await confirmationResult.confirm(code);
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
