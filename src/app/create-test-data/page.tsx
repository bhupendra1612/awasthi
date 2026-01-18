"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreateTestDataPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const supabase = createClient();

    const createSampleDailyTests = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch('/api/fix-daily-tests-schema', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Create Test Data</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Create Sample Daily Tests</h2>
                <p className="text-gray-600 mb-4">
                    This will create sample daily practice tests with questions for testing purposes.
                </p>

                <button
                    onClick={createSampleDailyTests}
                    disabled={loading}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Sample Daily Tests"}
                </button>

                {message && (
                    <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}