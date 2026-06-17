export default function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div
        className="w-12 h-12 rounded-full border-4 border-[#cee5f8] border-t-[#3696e7] animate-spin"
        role="status"
        aria-label="Yüklənir"
      />
    </div>
  );
}
