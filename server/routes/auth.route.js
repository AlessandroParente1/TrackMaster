import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { validateResource } from "../middleware/middleware.js";
import { loginSchema } from "../schema/validation.schema.js";
//firebase
import firebaseConfig from '../../client/src/firebaseConfig.js';
const { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } = firebaseConfig;

const router = express.Router();

// Route to handle email/password login
router.post("/login", validateResource(loginSchema), login);

// Route to handle email/password login using Firebase
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    res.status(200).json({ user: userCredential.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to handle Google login using Firebase
router.post('/login/google', async (req, res) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    res.status(200).json({ user: result.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;