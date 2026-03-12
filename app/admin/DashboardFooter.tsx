export default function DashboardFooter() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between text-sm font-normal text-gray-400">
        <p>
          Â©Car Bazaar Ltd {new Date().getFullYear()}, All Rights Reserved.{" "}
          <span className="font-normal">Created By Kenpro Media</span>
        </p>
        <span className="font-normal">V1.6.6</span>
      </div>
    </footer>
  );
}
