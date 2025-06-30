// scripts/seedDoctors.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// ✅ Same config as your app
const firebaseConfig = {
  apiKey: "AIzaSyBiJ5euN72Y64Fr_-nR4zewBb9y_oS7IBg",
  authDomain: "gestiva-a2aba.firebaseapp.com",
  projectId: "gestiva-a2aba",
  storageBucket: "gestiva-a2aba.appspot.com", 
  messagingSenderId: "917482537229",
  appId: "1:917482537229:web:9fe33502ec68a885747044",
  measurementId: "G-YN6XMQDE73"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const doctors = [
  {
    name: "Dr. Anu Sidana",
    specialization: "Gynecologist/Obstetrician",
    city: "Gurgaon",
    phone: "+91 99999 00001",
    experience: "25 years",
    consultationFee: 700,
    photoUrl: "",
  },
  {
    name: "Dr. Gayatri Aryan",
    specialization: "Gynecologist/Obstetrician",
    city: "Gurgaon",
    phone: "+91 99999 00002",
    experience: "19 years",
    consultationFee: 700,
    photoUrl: "",
  },
  {
    name: "Dr. Renu Raina Sehgal",
    specialization: "Gynecologist/Obstetrician",
    city: "Gurgaon",
    phone: "+91 99999 00003",
    experience: "23 years",
    consultationFee: 1400,
    photoUrl: "",
  },
  {
    name: "Dr. Nitika Sobti",
    specialization: "Obstetrics & Gynaecology",
    city: "Delhi",
    phone: "+91 99999 00004",
    experience: "28 years",
    consultationFee: 1800,
    photoUrl: "",
  },
  {
    name: "Dr. Meenu Soni",
    specialization: "Obstetrician & Gynecologist",
    city: "Delhi",
    phone: "+91 99999 00005",
    experience: "27 years",
    consultationFee: 1800,
    photoUrl: "",
  },
  {
    name: "Dr. Alka Kriplani",
    specialization: "Gynecologist/Obstetrician",
    city: "Delhi",
    phone: "+91 80808 08069",
    experience: "20+ years",
    consultationFee: 1500,
    photoUrl: "",
  },
];

async function seedDoctors() {
  const doctorRef = collection(db, "doctors");

  for (const doctor of doctors) {
    try {
      await addDoc(doctorRef, doctor);
      console.log(`✅ Added: ${doctor.name}`);
    } catch (err) {
      console.error(`❌ Error adding ${doctor.name}`, err);
    }
  }
}

seedDoctors();
