import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ค่า Config ของโปรเจกต์คุณ (จากไฟล์ที่ส่งมา)
const firebaseConfig = {
  apiKey: "AIzaSyBVzI69dZ27Rtc8RxMEZje6lq-VFwwwAfc",
  authDomain: "freshket-onboarding.firebaseapp.com",
  projectId: "freshket-onboarding",
  storageBucket: "freshket-onboarding.firebasestorage.app",
  messagingSenderId: "703756964266",
  appId: "1:703756964266:web:db606680425624db381bd3"
};

const app = initializeApp(firebaseConfig);

// Export เพื่อนำไปใช้ในไฟล์อื่น
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);