import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <SettingsIcon className="text-primary-600" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Configure your coaching institute</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SettingsIcon className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Panel</h3>
                    <p className="text-gray-500 mb-6">
                        Configure site settings, contact information, and other preferences.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-blue-800">
                            <strong>Current Configuration:</strong><br />
                            • Institute: Awasthi Classes<br />
                            • Location: Hindaun, Rajasthan<br />
                            • Contact: +91 78911 36255<br />
                            • Email: AWASTHICLASSESHND@GMAIL.COM
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}