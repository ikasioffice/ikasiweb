import Link from "next/link";

export function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-2xl border border-[#d4a72c]/30 bg-[#d4a72c]/10 flex justify-between items-center gap-4">
      <div className="text-sm text-[#f4ede0]">
        💼 <strong className="text-[#d4a72c]">{message}</strong>
      </div>
      <Link href="/login" className="btn-gold px-5 py-2.5 rounded-full text-xs whitespace-nowrap">
        Masuk dengan Google
      </Link>
    </div>
  );
}
