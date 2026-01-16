import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { templateId } = await request.json();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { data: template, error: templateError } = await supabase
            .from("daily_test_templates")
            .select("*")
            .eq("id", templateId)
            .single();

        if (templateError || !template) {
            return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
        }

        let questions = null;
        let aiProvider = "Demo";
        let errorMessage = "";

        // Try Gemini API
        if (GEMINI_API_KEY) {
            try {
                const geminiPrompt = `Generate exactly 10 multiple choice questions for ${template.exam_category} ${template.subject} exam.

Rules:
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include a brief explanation for each answer
- Difficulty: ${template.difficulty}
- Make questions relevant to Indian government competitive exams

Return ONLY a valid JSON array in this exact format (no other text):
[
{"question":"What is 2+2?","option_a":"3","option_b":"4","option_c":"5","option_d":"6","correct_option":"B","explanation":"2+2 equals 4"}
]`;

                const geminiResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: geminiPrompt }] }],
                            generationConfig: { temperature: 0.8, maxOutputTokens: 8000 }
                        })
                    }
                );

                if (geminiResponse.ok) {
                    const geminiData = await geminiResponse.json();
                    const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

                    // Clean the response
                    let cleaned = textContent.trim();
                    cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();

                    // Find JSON array
                    const startIdx = cleaned.indexOf("[");
                    const endIdx = cleaned.lastIndexOf("]");

                    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                        const jsonStr = cleaned.substring(startIdx, endIdx + 1);
                        const parsed = JSON.parse(jsonStr);

                        if (Array.isArray(parsed) && parsed.length > 0) {
                            questions = parsed;
                            aiProvider = "Gemini";
                        }
                    }
                } else {
                    const errData = await geminiResponse.text();
                    errorMessage = `Gemini error: ${geminiResponse.status} - ${errData.substring(0, 200)}`;
                }
            } catch (geminiErr: any) {
                errorMessage = `Gemini exception: ${geminiErr.message}`;
            }
        } else {
            errorMessage = "No GEMINI_API_KEY configured";
        }

        // Fallback to demo questions
        if (!questions) {
            questions = [
                { question: "भारत की राजधानी क्या है?", option_a: "मुंबई", option_b: "दिल्ली", option_c: "कोलकाता", option_d: "चेन्नई", correct_option: "B", explanation: "नई दिल्ली भारत की राजधानी है।" },
                { question: "What is the capital of India?", option_a: "Mumbai", option_b: "New Delhi", option_c: "Kolkata", option_d: "Chennai", correct_option: "B", explanation: "New Delhi is the capital of India." },
                { question: "Which river is known as Ganga of South?", option_a: "Krishna", option_b: "Godavari", option_c: "Kaveri", option_d: "Narmada", correct_option: "B", explanation: "Godavari is known as Ganga of South." },
                { question: "Who wrote the Indian National Anthem?", option_a: "Bankim Chandra", option_b: "Rabindranath Tagore", option_c: "Sarojini Naidu", option_d: "Muhammad Iqbal", correct_option: "B", explanation: "Rabindranath Tagore wrote Jana Gana Mana." },
                { question: "What is 15% of 200?", option_a: "25", option_b: "30", option_c: "35", option_d: "40", correct_option: "B", explanation: "15% of 200 = 30" },
                { question: "Which planet is the Red Planet?", option_a: "Venus", option_b: "Mars", option_c: "Jupiter", option_d: "Saturn", correct_option: "B", explanation: "Mars is the Red Planet." },
                { question: "Constitution of India adopted on?", option_a: "26 Jan 1950", option_b: "15 Aug 1947", option_c: "26 Nov 1949", option_d: "2 Oct 1950", correct_option: "C", explanation: "Adopted on 26 November 1949." },
                { question: "Largest state of India by area?", option_a: "MP", option_b: "Maharashtra", option_c: "Rajasthan", option_d: "UP", correct_option: "C", explanation: "Rajasthan is largest by area." },
                { question: "Father of Indian Constitution?", option_a: "Gandhi", option_b: "Nehru", option_c: "Ambedkar", option_d: "Patel", correct_option: "C", explanation: "Dr. B.R. Ambedkar." },
                { question: "National bird of India?", option_a: "Sparrow", option_b: "Peacock", option_c: "Parrot", option_d: "Eagle", correct_option: "B", explanation: "Indian Peacock is national bird." }
            ];
            aiProvider = "Demo";
        }

        // Create test in database
        const { data: test, error: testError } = await supabase
            .from("generated_daily_tests")
            .insert({
                template_id: template.id,
                title: `${template.exam_category} - ${template.subject} (${new Date().toLocaleDateString("en-IN")})`,
                exam_category: template.exam_category,
                subject: template.subject,
                difficulty: template.difficulty,
                questions_count: questions.length,
                duration_minutes: template.duration_minutes,
                status: "pending_approval",
                approval_deadline: new Date(Date.now() + 3600000).toISOString(),
                test_date: new Date().toISOString().split("T")[0]
            })
            .select()
            .single();

        if (testError) {
            return NextResponse.json({ success: false, error: testError.message }, { status: 500 });
        }

        // Insert questions
        const questionsToInsert = questions.map((q: any, i: number) => ({
            daily_test_id: test.id,
            question_text: q.question,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: (q.correct_option || "A").toUpperCase(),
            explanation: q.explanation || "",
            order_index: i
        }));

        const { error: qError } = await supabase.from("generated_daily_questions").insert(questionsToInsert);

        if (qError) {
            await supabase.from("generated_daily_tests").delete().eq("id", test.id);
            return NextResponse.json({ success: false, error: qError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: aiProvider === "Demo"
                ? `Test generated using Demo mode. ${errorMessage ? `(${errorMessage})` : "Add GEMINI_API_KEY to Vercel."}`
                : `Test generated successfully using ${aiProvider}! 🎉`,
            testId: test.id,
            questionsCount: questions.length,
            provider: aiProvider
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}