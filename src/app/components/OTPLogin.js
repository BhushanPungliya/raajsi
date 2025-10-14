"use client";

import { sendOTP, verifyOTP, resendOTP, mergeGuestCartWithUserCart, mergeGuestDataOnLogin } from "@/api/auth";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { auth } from "@/lib/firebaseConfig";

export default function OTPLogin({ setLoginOpen, onLoginSuccess }) {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showOtp, setShowOtp] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;
        if (showOtp && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showOtp, resendTimer]);

    const handleSendOTP = async () => {
        if (!phone) {
            toast.warning("Please enter phone number");
            return;
        }
        try {
            const res = await sendOTP(phone);
            if (res?.status === "success") {
                setShowOtp(true);
                setResendTimer(60);
                setCanResend(false);
                toast.success("OTP sent successfully");
            } else {
                toast.warning(res?.message || "Failed to send OTP");
            }
        } catch (err) {
            console.error("Send OTP Failed:", err);
            toast.error(err?.message || "Failed to send OTP");
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.warning("Please enter complete OTP");
            return;
        }
        try {
            const res = await verifyOTP(phone, otpString);
            if (res?.status === "success") {
                const token = res?.data?.user?.token;
                localStorage.setItem("token", token);
                
                // Merge guest cart and wishlist with user data after successful login
                try {
                    await mergeGuestDataOnLogin(token);
                } catch (mergeError) {
                    console.error("Error merging guest data:", mergeError);
                    // Don't block login if merging fails
                }

                toast.success("Login successful 🎉");
                setLoginOpen(false);
                
                // Call success callback if provided (for checkout page)
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else {
                toast.warning(res?.message || "Invalid OTP");
            }
        } catch (err) {
            console.error("Verify OTP Failed:", err);
            toast.error(err?.message || "Verification failed");
        }
    };

    const handleResendOTP = async () => {
        try {
            const res = await resendOTP(phone);
            if (res?.status === "success") {
                setResendTimer(60);
                setCanResend(false);
                toast.success("OTP resent successfully");
            } else {
                toast.warning(res?.message || "Failed to resend OTP");
            }
        } catch (err) {
            console.error("Resend OTP Failed:", err);
            toast.error(err?.message || "Failed to resend OTP");
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <div>
            <button className="auth-close-btn" onClick={() => setLoginOpen(false)} aria-label="Close login">&times;</button>
            <div id="authModalTitle" className="font-rose text-[24px] leading-[36px] text-[#4C0A2E] text-center pb-[10px]">
                {showOtp ? "ENTER OTP" : "LOGIN"}
            </div>
            <div className="max-w-[341px] w-full font-avenir-400 text-[16px] leading-[20px] text-center text-[#3C3C3C] mx-auto pb-[22px]">
                {showOtp ? <div>
                    <p className="text-center text-[#3C3C3C] mb-2 font-aviner-400 text-[16px]">
                        OTP sent to <span className="font-semibold">+91     {phone}</span>
                    </p>
                    Enter the 6-digit OTP
                </div> : "Sign-Up For Our Exclusive Launch Now and Get a 0% Discount on Products"}
            </div>
            {!showOtp ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendOTP();
                    }}
                    className="auth-form"
                >
                    <div className="flex flex-col gap-[6px]">
                        <label className="font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C]">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setPhone(value);
                            }}
                            className="w-full font-aviner-400 text-[16px] leading-[24px] text-[#3C3C3C] placeholder-[#3C3C3C80] py-[12px] px-[20px] bg-[#F9FAFB] border border-[#D9D9D9] rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#00000033] focus:border-[#000000] transition-all duration-200"
                            placeholder="Enter 10-digit Phone Number"
                            required
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                        />

                    </div>
                    <div className="text-center mt-4">
                        <button type="submit" className="btn auth-submit-btn">
                            Send OTP
                        </button>
                    </div>
                </form>
            ) : (
                <div className="auth-form">
                    <div className="flex justify-center gap-2 mb-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[0-9]?$/.test(value)) {
                                        handleOtpChange(index, value);
                                    }
                                }}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="lg:w-12 w-10 lg:h-12 h-10 text-center font-aviner-400 text-[16px] leading-[20px] text-[#3C3C3C] bg-[#D9D9D933] border-[0.5px] border-[#D9D9D9] rounded-[4px] focus:outline-none focus:border-[#4C0A2E]"
                                maxLength={1}
                            />
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <button onClick={handleVerifyOTP} className="btn auth-submit-btn">
                            Verify OTP
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        {canResend ? (
                            <button onClick={handleResendOTP} className="text-[#4C0A2E] underline">
                                Resend OTP
                            </button>
                        ) : (
                            <span className="text-[#3C3C3C]">Resend OTP in {resendTimer}s</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
