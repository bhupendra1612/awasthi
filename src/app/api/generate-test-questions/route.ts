import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const {
            examCategory,
            subject,
            difficulty,
            questionsCount,
            topics
        } = await request.json();

        if (!GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                error: "AI service not configured"
            }, { status: 500 });
        }

        const topicsText = topics && topics.length > 0 ? `Topics: ${topics.join(", ")}` : "";

        const prompt = `Generate exactly ${questionsCount} multiple choice questions for ${examCategory} ${subject} exam.

${topicsText}

CRITICAL RULES:
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include a brief explanation for each answer (max 80 characters)
- Difficulty: ${difficulty}
- Make questions relevant to Indian government competitive exams
- Questions should be in Hinglish (mix of Hindi and English in Roman script)
- Avoid pure Hindi Devanagari script
- IMPORTANT: Use simple text only, no special characters or quotes inside strings
- Do NOT use apostrophes or quotes in question text
- Keep all text simple and clean

Return ONLY a valid JSON array with NO markdown, NO code blocks, NO extra text.
Format: [{"question":"text","option_a":"text","option_b":"text","option_c":"text","option_d":"text","correct_option":"A","explanation":"text","marks":1}]

Generate ${Math.min(questionsCount, 20)} questions now:`;

        try {
            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 8000,
                            topP: 0.95,
                            topK: 40
                        }
                    })
                }
            );

            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();
                console.error("Gemini API error:", errorText);
                throw new Error("Failed to generate questions");
            }

            const geminiData = await geminiResponse.json();
            const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            console.log("Raw AI response:", textContent.substring(0, 500));

            // Clean the response aggressively
            let cleaned = textContent.trim();

            // Remove markdown code blocks
            cleaned = cleaned.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

            // Remove any text before the first [
            const startIdx = cleaned.indexOf("[");
            const endIdx = cleaned.lastIndexOf("]");

            if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
                console.error("No JSON array found in response:", cleaned);
                throw new Error("Invalid JSON response from AI - no array found");
            }

            let jsonStr = cleaned.substring(startIdx, endIdx + 1);

            // Fix common JSON issues
            // Replace smart quotes with regular quotes
            jsonStr = jsonStr.replace(/[\u201C\u201D]/g, '"');
            jsonStr = jsonStr.replace(/[\u2018\u2019]/g, "'");

            // Remove any control characters that might break JSON
            jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, " ");

            console.log("Cleaned JSON (first 500 chars):", jsonStr.substring(0, 500));

            let questions;
            try {
                questions = JSON.parse(jsonStr);
            } catch (parseError: any) {
                console.error("JSON parse error:", parseError.message);
                console.error("Failed JSON string:", jsonStr.substring(0, 1000));

                // Try to fix common issues and parse again
                try {
                    // Fix unescaped quotes in strings
                    let fixedJson = jsonStr;

                    // Try to extract individual question objects and rebuild array
                    const questionMatches = jsonStr.match(/\{[^}]+\}/g);
                    if (questionMatches && questionMatches.length > 0) {
                        const validQuestions = [];
                        for (const match of questionMatches) {
                            try {
                                const q = JSON.parse(match);
                                if (q.question && q.option_a && q.correct_option) {
                                    validQuestions.push(q);
                                }
                            } catch (e) {
                                // Skip invalid question
                            }
                        }
                        if (validQuestions.length > 0) {
                            questions = validQuestions;
                            console.log(`Recovered ${validQuestions.length} questions from malformed JSON`);
                        } else {
                            throw new Error("Could not recover any valid questions");
                        }
                    } else {
                        throw new Error("No question objects found");
                    }
                } catch (recoveryError: any) {
                    throw new Error(`JSON parsing failed and recovery failed: ${parseError.message}`);
                }
            }

            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error("No valid questions generated");
            }

            // Validate and clean questions
            questions = questions.filter(q =>
                q.question &&
                q.option_a &&
                q.option_b &&
                q.correct_option
            ).map(q => ({
                question: String(q.question || "").trim(),
                option_a: String(q.option_a || "").trim(),
                option_b: String(q.option_b || "").trim(),
                option_c: String(q.option_c || "").trim(),
                option_d: String(q.option_d || "").trim(),
                correct_option: String(q.correct_option || "A").toUpperCase(),
                explanation: String(q.explanation || "").trim(),
                marks: Number(q.marks) || 1
            }));

            return NextResponse.json({
                success: true,
                questions: questions,
                count: questions.length
            });

        } catch (aiError: any) {
            console.error("AI generation error:", aiError);
            return NextResponse.json({
                success: false,
                error: `AI generation failed: ${aiError.message}`
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Generate questions error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Something went wrong"
        }, { status: 500 });
    }
}
