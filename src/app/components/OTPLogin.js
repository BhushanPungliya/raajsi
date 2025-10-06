"use client";

import { login } from "@/api/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
// import { auth } from "@/lib/firebaseConfig";

export default function OTPLogin({ setLoginOpen }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await login(email, password);
            // console.log("Login Success:", res);

            if (res?.status === "success") {
                localStorage.setItem("token", res?.data?.user?.token);
                toast.success("Login successful 🎉");
                setLoginOpen(false);
            } else {
                toast.warning(res?.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Login Failed:", err);
            toast.error(err?.message || "Login failed ❌");
        }
    };


    return (
        <div>
            <button className="auth-close-btn" onClick={() => setLoginOpen(false)} aria-label="Close login">&times;</button>
            <div id="authModalTitle" className="font-rose text-[24px] leading-[36px] text-[#4C0A2E] text-center pb-[10px]">LOGIN</div>
            <div className="max-w-[341px] w-full font-avenir-400 text-[16px] leading-[20px] text-center text-[#3C3C3C] mx-auto pb-[22px]">Sign-Up For Our Exclusive Launch Now and Get a 0% Discount on Products</div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin(); // yaha function call karna zaroori hai
                }}
                className="auth-form"
            >
                <div className="flex flex-col gap-[6px]">
                    <label className="font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C]">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="font-aviner-400 text-[16px] leading-[20px] text-[#3C3C3C80] py-[11px] px-[25px] bg-[#D9D9D933] border-[0.5px] border-[#D9D9D9] rounded-[4px]"
                        placeholder="Email Address"
                    />
                </div>
                <div className="flex flex-col gap-[6px] pt-[10px]">
                <label className="font-avenir-400 text-[16px] leading-[20px] text-[#3C3C3C]">Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-aviner-400 text-[16px] leading-[20px] text-[#3C3C3C80] py-[11px] px-[25px] bg-[#D9D9D933] border-[0.5px] border-[#D9D9D9] rounded-[4px]"
                />
                </div>

                {/* Agar phone number bhi lena ho to niche wala uncomment karna */}
                {/* 
  <label className="form-label small fw-semibold mb-1 mt-3">Phone</label>
  <div className="d-flex align-items-stretch auth-phone-group">
    <select className="form-select auth-country-select" defaultValue="IN">
      <option value="IN">🇮🇳 +91</option>
      <option value="US">🇺🇸 +1</option>
      <option value="GB">🇬🇧 +44</option>
    </select>
    <input
      type="tel"
      className="form-control auth-input flex-grow-1"
      placeholder="Enter Your Number"
    />
  </div> 
  */}

                <div className="text-center mt-4">
                    <button type="submit" className="btn auth-submit-btn">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
