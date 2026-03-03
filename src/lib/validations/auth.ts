import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi girin"),
  password: z
    .string()
    .min(1, "Şifre gereklidir"),
});

export const registerSchema = z
  .object({
    company_name: z
      .string()
      .min(2, "Firma adı en az 2 karakter olmalıdır"),
    tax_number: z
      .string()
      .min(10, "Vergi numarası en az 10 karakter olmalıdır")
      .max(11, "Vergi numarası en fazla 11 karakter olmalıdır"),
    tax_office: z.string().optional(),
    sector: z.string().optional(),
    full_name: z
      .string()
      .min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z
      .string()
      .min(1, "E-posta adresi gereklidir")
      .email("Geçerli bir e-posta adresi girin"),
    phone: z
      .string()
      .min(10, "Telefon numarası en az 10 karakter olmalıdır"),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır"),
    confirmPassword: z
      .string()
      .min(1, "Şifre tekrarı gereklidir"),
    city: z.string().optional(),
    district: z.string().optional(),
    company_address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi girin"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
