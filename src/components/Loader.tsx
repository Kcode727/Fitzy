// components/Loader.tsx
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ff4a4a] border-opacity-50"></div>
    </div>
  );
}
