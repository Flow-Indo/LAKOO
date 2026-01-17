export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-gray-600">No new notifications</p>
        </div>
      </div>
    </div>
  );
}