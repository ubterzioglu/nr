import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  kvkkConsent: z
    .boolean()
    .refine((value) => value === true, "KVKK aydınlatma metnini onaylamanız gerekir"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const resetRequestSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
});

export type ResetRequestFormData = z.infer<typeof resetRequestSchema>;

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor",
    path: ["passwordConfirm"],
  });

export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
