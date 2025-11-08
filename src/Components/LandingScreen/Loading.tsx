const Loading = () => {
  return (
    <div className="flex w-full flex-1 items-center justify-center text-center">
      <div className="flex flex-col items-center gap-3 text-gray-600">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />
        <p className="text-sm font-medium">Loading today&apos;s puzzle…</p>
      </div>
    </div>
  );
};

export default Loading;
